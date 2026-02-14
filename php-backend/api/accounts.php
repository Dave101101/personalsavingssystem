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
        // Get all accounts for user
        $query = "SELECT * FROM accounts WHERE user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $accounts = [];
        while ($row = $result->fetch_assoc()) {
            $accounts[] = $row;
        }
        
        sendResponse(true, $accounts, 'Accounts retrieved successfully');
        break;

    case 'PUT':
        // Update account balance
        $data = getPostData();
        $missing = validateRequired($data, ['account_type', 'amount', 'operation']);
        
        if (!empty($missing)) {
            sendResponse(false, null, 'Missing fields: ' . implode(', ', $missing), 400);
        }

        $accountType = $data['account_type'];
        $amount = floatval($data['amount']);
        $operation = $data['operation']; // 'add' or 'subtract'

        $conn->begin_transaction();

        try {
            // Get current balance
            $query = "SELECT id, balance FROM accounts WHERE user_id = ? AND account_type = ? FOR UPDATE";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("is", $userId, $accountType);
            $stmt->execute();
            $result = $stmt->get_result();
            $account = $result->fetch_assoc();

            if (!$account) {
                throw new Exception("Account not found");
            }

            $newBalance = $account['balance'];
            if ($operation === 'add') {
                $newBalance += $amount;
            } else if ($operation === 'subtract') {
                if ($newBalance < $amount) {
                    throw new Exception("Insufficient balance");
                }
                $newBalance -= $amount;
            }

            // Update balance
            $updateQuery = "UPDATE accounts SET balance = ?, updated_at = NOW() WHERE id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param("di", $newBalance, $account['id']);
            $updateStmt->execute();

            // Record transaction
            $transType = $operation === 'add' ? 'credit' : 'debit';
            $category = $data['category'] ?? 'General';
            $description = $data['description'] ?? '';
            
            $transQuery = "INSERT INTO transactions (user_id, account_id, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)";
            $transStmt = $conn->prepare($transQuery);
            $transStmt->bind_param("iissds", $userId, $account['id'], $transType, $category, $amount, $description);
            $transStmt->execute();

            $conn->commit();

            sendResponse(true, [
                'new_balance' => $newBalance,
                'transaction_id' => $transStmt->insert_id
            ], 'Account updated successfully');

        } catch (Exception $e) {
            $conn->rollback();
            sendResponse(false, null, $e->getMessage(), 400);
        }
        break;

    default:
        sendResponse(false, null, 'Method not allowed', 405);
        break;
}

$db->disconnect();
?>
