<?php
require_once '../config.php';

$db = new Database();
$conn = $db->connect();

if (!$conn) {
    sendResponse(false, null, 'Database connection failed', 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$userId = getCurrentUserId();

switch ($method) {
    case 'GET':
        // Get all bills for user
        $status = $_GET['status'] ?? null;
        
        $query = "SELECT * FROM bills WHERE user_id = ?";
        $params = [$userId];
        $types = "i";
        
        if ($status) {
            $query .= " AND status = ?";
            $params[] = $status;
            $types .= "s";
        }
        
        $query .= " ORDER BY due_date ASC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $bills = [];
        while ($row = $result->fetch_assoc()) {
            $bills[] = $row;
        }
        
        sendResponse(true, $bills, 'Bills retrieved successfully');
        break;

    case 'POST':
        // Create new bill
        $data = getPostData();
        $missing = validateRequired($data, ['bill_type', 'biller_name', 'amount', 'due_date']);
        
        if (!empty($missing)) {
            sendResponse(false, null, 'Missing fields: ' . implode(', ', $missing), 400);
        }

        $billType = $data['bill_type'];
        $billerName = $data['biller_name'];
        $amount = floatval($data['amount']);
        $dueDate = $data['due_date'];
        $isRecurring = isset($data['is_recurring']) ? intval($data['is_recurring']) : 0;
        $recurrenceFrequency = $data['recurrence_frequency'] ?? null;
        $accountNumber = $data['account_number'] ?? null;
        $referenceNumber = $data['reference_number'] ?? null;

        $query = "INSERT INTO bills (user_id, bill_type, biller_name, amount, due_date, is_recurring, recurrence_frequency, account_number, reference_number) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("issdsssss", $userId, $billType, $billerName, $amount, $dueDate, $isRecurring, $recurrenceFrequency, $accountNumber, $referenceNumber);
        
        if ($stmt->execute()) {
            $billId = $stmt->insert_id;
            sendResponse(true, ['bill_id' => $billId], 'Bill created successfully', 201);
        } else {
            sendResponse(false, null, 'Failed to create bill', 400);
        }
        break;

    case 'PUT':
        // Pay bill or update bill details
        $data = getPostData();
        $billId = $data['bill_id'] ?? null;
        
        if (!$billId) {
            sendResponse(false, null, 'Bill ID required', 400);
        }

        // Check if this is a payment action
        if (isset($data['action']) && $data['action'] === 'pay') {
            $conn->begin_transaction();

            try {
                // Get bill details
                $billQuery = "SELECT * FROM bills WHERE id = ? AND user_id = ? FOR UPDATE";
                $billStmt = $conn->prepare($billQuery);
                $billStmt->bind_param("ii", $billId, $userId);
                $billStmt->execute();
                $billResult = $billStmt->get_result();
                $bill = $billResult->fetch_assoc();

                if (!$bill) {
                    throw new Exception("Bill not found");
                }

                if ($bill['status'] === 'paid') {
                    throw new Exception("Bill already paid");
                }

                // Get main account
                $accountQuery = "SELECT id, balance FROM accounts WHERE user_id = ? AND account_type = 'main' FOR UPDATE";
                $accountStmt = $conn->prepare($accountQuery);
                $accountStmt->bind_param("i", $userId);
                $accountStmt->execute();
                $accountResult = $accountStmt->get_result();
                $account = $accountResult->fetch_assoc();

                if ($account['balance'] < $bill['amount']) {
                    throw new Exception("Insufficient balance");
                }

                // Update bill status
                $updateBillQuery = "UPDATE bills SET status = 'paid', paid_at = NOW(), updated_at = NOW() WHERE id = ?";
                $updateBillStmt = $conn->prepare($updateBillQuery);
                $updateBillStmt->bind_param("i", $billId);
                $updateBillStmt->execute();

                // Deduct from account
                $newBalance = $account['balance'] - $bill['amount'];
                $updateAccountQuery = "UPDATE accounts SET balance = ?, updated_at = NOW() WHERE id = ?";
                $updateAccountStmt = $conn->prepare($updateAccountQuery);
                $updateAccountStmt->bind_param("di", $newBalance, $account['id']);
                $updateAccountStmt->execute();

                // Record transaction
                $transQuery = "INSERT INTO transactions (user_id, account_id, type, category, amount, description) VALUES (?, ?, 'debit', 'Bills', ?, ?)";
                $transStmt = $conn->prepare($transQuery);
                $description = "Bill payment: {$bill['biller_name']} - {$bill['bill_type']}";
                $transStmt->bind_param("iids", $userId, $account['id'], $bill['amount'], $description);
                $transStmt->execute();

                // If recurring, create next bill
                if ($bill['is_recurring'] && $bill['recurrence_frequency']) {
                    $nextDueDate = date('Y-m-d', strtotime($bill['due_date'] . ' +1 ' . $bill['recurrence_frequency']));
                    
                    $nextBillQuery = "INSERT INTO bills (user_id, bill_type, biller_name, amount, due_date, is_recurring, recurrence_frequency, account_number) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    $nextBillStmt = $conn->prepare($nextBillQuery);
                    $nextBillStmt->bind_param("issdssss", $userId, $bill['bill_type'], $bill['biller_name'], $bill['amount'], $nextDueDate, $bill['is_recurring'], $bill['recurrence_frequency'], $bill['account_number']);
                    $nextBillStmt->execute();
                }

                $conn->commit();

                sendResponse(true, [
                    'new_balance' => $newBalance,
                    'amount_paid' => $bill['amount']
                ], 'Bill paid successfully');

            } catch (Exception $e) {
                $conn->rollback();
                sendResponse(false, null, $e->getMessage(), 400);
            }
        } else {
            // Update bill details
            $updates = [];
            $params = [];
            $types = "";

            if (isset($data['amount'])) {
                $updates[] = "amount = ?";
                $params[] = floatval($data['amount']);
                $types .= "d";
            }
            if (isset($data['due_date'])) {
                $updates[] = "due_date = ?";
                $params[] = $data['due_date'];
                $types .= "s";
            }
            if (isset($data['status'])) {
                $updates[] = "status = ?";
                $params[] = $data['status'];
                $types .= "s";
            }

            if (empty($updates)) {
                sendResponse(false, null, 'No fields to update', 400);
            }

            $updates[] = "updated_at = NOW()";
            $params[] = $billId;
            $params[] = $userId;
            $types .= "ii";

            $query = "UPDATE bills SET " . implode(", ", $updates) . " WHERE id = ? AND user_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param($types, ...$params);

            if ($stmt->execute()) {
                sendResponse(true, null, 'Bill updated successfully');
            } else {
                sendResponse(false, null, 'Failed to update bill', 400);
            }
        }
        break;

    case 'DELETE':
        // Delete bill
        $billId = $_GET['id'] ?? null;
        
        if (!$billId) {
            sendResponse(false, null, 'Bill ID required', 400);
        }

        $query = "DELETE FROM bills WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $billId, $userId);
        
        if ($stmt->execute()) {
            sendResponse(true, null, 'Bill deleted successfully');
        } else {
            sendResponse(false, null, 'Failed to delete bill', 400);
        }
        break;

    default:
        sendResponse(false, null, 'Method not allowed', 405);
        break;
}

$db->disconnect();
?>
