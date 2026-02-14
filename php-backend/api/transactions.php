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
        // Get all transactions for user with optional filters
        $accountType = $_GET['account_type'] ?? null;
        $category = $_GET['category'] ?? null;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
        $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

        $query = "SELECT t.*, a.account_type FROM transactions t 
                  INNER JOIN accounts a ON t.account_id = a.id 
                  WHERE t.user_id = ?";
        
        $params = [$userId];
        $types = "i";

        if ($accountType) {
            $query .= " AND a.account_type = ?";
            $params[] = $accountType;
            $types .= "s";
        }

        if ($category) {
            $query .= " AND t.category = ?";
            $params[] = $category;
            $types .= "s";
        }

        $query .= " ORDER BY t.transaction_date DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= "ii";

        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $transactions = [];
        while ($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }
        
        sendResponse(true, $transactions, 'Transactions retrieved successfully');
        break;

    case 'POST':
        // Create new transaction
        $data = getPostData();
        $missing = validateRequired($data, ['account_type', 'type', 'category', 'amount']);
        
        if (!empty($missing)) {
            sendResponse(false, null, 'Missing fields: ' . implode(', ', $missing), 400);
        }

        $accountType = $data['account_type'];
        $type = $data['type'];
        $category = $data['category'];
        $amount = floatval($data['amount']);
        $description = $data['description'] ?? '';
        $status = $data['status'] ?? 'completed';

        $conn->begin_transaction();

        try {
            // Get account
            $query = "SELECT id, balance FROM accounts WHERE user_id = ? AND account_type = ? FOR UPDATE";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("is", $userId, $accountType);
            $stmt->execute();
            $result = $stmt->get_result();
            $account = $result->fetch_assoc();

            if (!$account) {
                throw new Exception("Account not found");
            }

            // Update balance
            $newBalance = $account['balance'];
            if ($type === 'credit') {
                $newBalance += $amount;
            } else if ($type === 'debit') {
                if ($newBalance < $amount) {
                    throw new Exception("Insufficient balance");
                }
                $newBalance -= $amount;
            }

            $updateQuery = "UPDATE accounts SET balance = ?, updated_at = NOW() WHERE id = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param("di", $newBalance, $account['id']);
            $updateStmt->execute();

            // Insert transaction
            $transQuery = "INSERT INTO transactions (user_id, account_id, type, category, amount, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $transStmt = $conn->prepare($transQuery);
            $transStmt->bind_param("iissdss", $userId, $account['id'], $type, $category, $amount, $description, $status);
            $transStmt->execute();

            $transactionId = $transStmt->insert_id;

            $conn->commit();

            sendResponse(true, [
                'transaction_id' => $transactionId,
                'new_balance' => $newBalance
            ], 'Transaction created successfully', 201);

        } catch (Exception $e) {
            $conn->rollback();
            sendResponse(false, null, $e->getMessage(), 400);
        }
        break;

    case 'DELETE':
        // Delete transaction (admin only - implement proper authorization)
        $transactionId = $_GET['id'] ?? null;
        
        if (!$transactionId) {
            sendResponse(false, null, 'Transaction ID required', 400);
        }

        $query = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $transactionId, $userId);
        
        if ($stmt->execute()) {
            sendResponse(true, null, 'Transaction deleted successfully');
        } else {
            sendResponse(false, null, 'Failed to delete transaction', 400);
        }
        break;

    default:
        sendResponse(false, null, 'Method not allowed', 405);
        break;
}

$db->disconnect();
?>
