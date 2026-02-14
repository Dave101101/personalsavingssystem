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
        // Get all investments for user
        $status = $_GET['status'] ?? null;
        
        $query = "SELECT * FROM investments WHERE user_id = ?";
        $params = [$userId];
        $types = "i";
        
        if ($status) {
            $query .= " AND status = ?";
            $params[] = $status;
            $types .= "s";
        }
        
        $query .= " ORDER BY purchase_date DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $investments = [];
        $totalInvested = 0;
        $totalCurrentValue = 0;
        
        while ($row = $result->fetch_assoc()) {
            $totalInvested += $row['amount_invested'];
            $totalCurrentValue += $row['current_value'];
            $investments[] = $row;
        }
        
        $totalReturn = $totalInvested > 0 ? (($totalCurrentValue - $totalInvested) / $totalInvested) * 100 : 0;
        
        sendResponse(true, [
            'investments' => $investments,
            'summary' => [
                'total_invested' => $totalInvested,
                'total_current_value' => $totalCurrentValue,
                'total_return_percentage' => round($totalReturn, 2)
            ]
        ], 'Investments retrieved successfully');
        break;

    case 'POST':
        // Create new investment
        $data = getPostData();
        $missing = validateRequired($data, ['investment_name', 'investment_type', 'amount_invested', 'purchase_date']);
        
        if (!empty($missing)) {
            sendResponse(false, null, 'Missing fields: ' . implode(', ', $missing), 400);
        }

        $investmentName = $data['investment_name'];
        $investmentType = $data['investment_type'];
        $amountInvested = floatval($data['amount_invested']);
        $currentValue = floatval($data['current_value'] ?? $amountInvested);
        $purchaseDate = $data['purchase_date'];
        $maturityDate = $data['maturity_date'] ?? null;
        $description = $data['description'] ?? '';

        $returnPercentage = $amountInvested > 0 ? (($currentValue - $amountInvested) / $amountInvested) * 100 : 0;

        $conn->begin_transaction();

        try {
            // Check if user has sufficient balance
            $accountQuery = "SELECT id, balance FROM accounts WHERE user_id = ? AND account_type = 'main' FOR UPDATE";
            $accountStmt = $conn->prepare($accountQuery);
            $accountStmt->bind_param("i", $userId);
            $accountStmt->execute();
            $accountResult = $accountStmt->get_result();
            $account = $accountResult->fetch_assoc();

            if ($account['balance'] < $amountInvested) {
                throw new Exception("Insufficient balance");
            }

            // Create investment
            $query = "INSERT INTO investments (user_id, investment_name, investment_type, amount_invested, current_value, return_percentage, purchase_date, maturity_date, description) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("issdddsss", $userId, $investmentName, $investmentType, $amountInvested, $currentValue, $returnPercentage, $purchaseDate, $maturityDate, $description);
            $stmt->execute();
            
            $investmentId = $stmt->insert_id;

            // Deduct from main account
            $newBalance = $account['balance'] - $amountInvested;
            $updateAccountQuery = "UPDATE accounts SET balance = ?, updated_at = NOW() WHERE id = ?";
            $updateAccountStmt = $conn->prepare($updateAccountQuery);
            $updateAccountStmt->bind_param("di", $newBalance, $account['id']);
            $updateAccountStmt->execute();

            // Record transaction
            $transQuery = "INSERT INTO transactions (user_id, account_id, type, category, amount, description) VALUES (?, ?, 'debit', 'Investment', ?, ?)";
            $transStmt = $conn->prepare($transQuery);
            $transDescription = "Investment in: {$investmentName}";
            $transStmt->bind_param("iids", $userId, $account['id'], $amountInvested, $transDescription);
            $transStmt->execute();

            $conn->commit();

            sendResponse(true, [
                'investment_id' => $investmentId,
                'new_balance' => $newBalance
            ], 'Investment created successfully', 201);

        } catch (Exception $e) {
            $conn->rollback();
            sendResponse(false, null, $e->getMessage(), 400);
        }
        break;

    case 'PUT':
        // Update investment (typically current value and return)
        $data = getPostData();
        $investmentId = $data['investment_id'] ?? null;
        
        if (!$investmentId) {
            sendResponse(false, null, 'Investment ID required', 400);
        }

        $updates = [];
        $params = [];
        $types = "";

        if (isset($data['current_value'])) {
            $currentValue = floatval($data['current_value']);
            $updates[] = "current_value = ?";
            $params[] = $currentValue;
            $types .= "d";

            // Get amount invested to calculate return
            $getQuery = "SELECT amount_invested FROM investments WHERE id = ? AND user_id = ?";
            $getStmt = $conn->prepare($getQuery);
            $getStmt->bind_param("ii", $investmentId, $userId);
            $getStmt->execute();
            $getResult = $getStmt->get_result();
            $investment = $getResult->fetch_assoc();

            if ($investment) {
                $returnPercentage = $investment['amount_invested'] > 0 ? 
                    (($currentValue - $investment['amount_invested']) / $investment['amount_invested']) * 100 : 0;
                $updates[] = "return_percentage = ?";
                $params[] = $returnPercentage;
                $types .= "d";
            }
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
        $params[] = $investmentId;
        $params[] = $userId;
        $types .= "ii";

        $query = "UPDATE investments SET " . implode(", ", $updates) . " WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            sendResponse(true, null, 'Investment updated successfully');
        } else {
            sendResponse(false, null, 'Failed to update investment', 400);
        }
        break;

    case 'DELETE':
        // Sell/liquidate investment
        $investmentId = $_GET['id'] ?? null;
        
        if (!$investmentId) {
            sendResponse(false, null, 'Investment ID required', 400);
        }

        $conn->begin_transaction();

        try {
            // Get investment details
            $query = "SELECT * FROM investments WHERE id = ? AND user_id = ? FOR UPDATE";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ii", $investmentId, $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $investment = $result->fetch_assoc();

            if (!$investment) {
                throw new Exception("Investment not found");
            }

            // Get main account
            $accountQuery = "SELECT id, balance FROM accounts WHERE user_id = ? AND account_type = 'main' FOR UPDATE";
            $accountStmt = $conn->prepare($accountQuery);
            $accountStmt->bind_param("i", $userId);
            $accountStmt->execute();
            $accountResult = $accountStmt->get_result();
            $account = $accountResult->fetch_assoc();

            // Add current value back to account
            $newBalance = $account['balance'] + $investment['current_value'];
            $updateAccountQuery = "UPDATE accounts SET balance = ?, updated_at = NOW() WHERE id = ?";
            $updateAccountStmt = $conn->prepare($updateAccountQuery);
            $updateAccountStmt->bind_param("di", $newBalance, $account['id']);
            $updateAccountStmt->execute();

            // Record transaction
            $transQuery = "INSERT INTO transactions (user_id, account_id, type, category, amount, description) VALUES (?, ?, 'credit', 'Investment', ?, ?)";
            $transStmt = $conn->prepare($transQuery);
            $transDescription = "Liquidated investment: {$investment['investment_name']}";
            $transStmt->bind_param("iids", $userId, $account['id'], $investment['current_value'], $transDescription);
            $transStmt->execute();

            // Update investment status
            $updateInvestQuery = "UPDATE investments SET status = 'sold', updated_at = NOW() WHERE id = ?";
            $updateInvestStmt = $conn->prepare($updateInvestQuery);
            $updateInvestStmt->bind_param("i", $investmentId);
            $updateInvestStmt->execute();

            $conn->commit();

            sendResponse(true, [
                'liquidated_amount' => $investment['current_value'],
                'new_balance' => $newBalance
            ], 'Investment liquidated successfully');

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
