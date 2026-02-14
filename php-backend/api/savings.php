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
        // Get all savings plans for user
        $status = $_GET['status'] ?? null;
        
        $query = "SELECT * FROM savings_plans WHERE user_id = ?";
        $params = [$userId];
        $types = "i";
        
        if ($status) {
            $query .= " AND status = ?";
            $params[] = $status;
            $types .= "s";
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $plans = [];
        while ($row = $result->fetch_assoc()) {
            // Calculate progress
            $progress = $row['target_amount'] > 0 ? ($row['current_amount'] / $row['target_amount']) * 100 : 0;
            $row['progress'] = round($progress, 2);
            $plans[] = $row;
        }
        
        sendResponse(true, $plans, 'Savings plans retrieved successfully');
        break;

    case 'POST':
        // Create new savings plan
        $data = getPostData();
        $missing = validateRequired($data, ['plan_name', 'target_amount', 'frequency', 'start_date', 'end_date']);
        
        if (!empty($missing)) {
            sendResponse(false, null, 'Missing fields: ' . implode(', ', $missing), 400);
        }

        $planName = $data['plan_name'];
        $targetAmount = floatval($data['target_amount']);
        $frequency = $data['frequency'];
        $startDate = $data['start_date'];
        $endDate = $data['end_date'];
        $description = $data['description'] ?? '';
        $icon = $data['icon'] ?? 'piggy-bank';
        $color = $data['color'] ?? '#6366f1';
        $autoSave = isset($data['auto_save']) ? intval($data['auto_save']) : 0;

        $query = "INSERT INTO savings_plans (user_id, plan_name, target_amount, frequency, start_date, end_date, description, icon, color, auto_save) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("isdssssssi", $userId, $planName, $targetAmount, $frequency, $startDate, $endDate, $description, $icon, $color, $autoSave);
        
        if ($stmt->execute()) {
            $planId = $stmt->insert_id;
            sendResponse(true, ['plan_id' => $planId], 'Savings plan created successfully', 201);
        } else {
            sendResponse(false, null, 'Failed to create savings plan', 400);
        }
        break;

    case 'PUT':
        // Update savings plan or add/withdraw money
        $data = getPostData();
        $planId = $data['plan_id'] ?? null;
        
        if (!$planId) {
            sendResponse(false, null, 'Plan ID required', 400);
        }

        // Check if this is a transaction (deposit/withdrawal)
        if (isset($data['transaction_type'])) {
            $transactionType = $data['transaction_type'];
            $amount = floatval($data['amount']);
            $notes = $data['notes'] ?? '';

            $conn->begin_transaction();

            try {
                // Get plan and main account
                $planQuery = "SELECT * FROM savings_plans WHERE id = ? AND user_id = ? FOR UPDATE";
                $planStmt = $conn->prepare($planQuery);
                $planStmt->bind_param("ii", $planId, $userId);
                $planStmt->execute();
                $planResult = $planStmt->get_result();
                $plan = $planResult->fetch_assoc();

                if (!$plan) {
                    throw new Exception("Savings plan not found");
                }

                $accountQuery = "SELECT id, balance FROM accounts WHERE user_id = ? AND account_type = 'main' FOR UPDATE";
                $accountStmt = $conn->prepare($accountQuery);
                $accountStmt->bind_param("i", $userId);
                $accountStmt->execute();
                $accountResult = $accountStmt->get_result();
                $account = $accountResult->fetch_assoc();

                $newPlanAmount = $plan['current_amount'];
                $newAccountBalance = $account['balance'];

                if ($transactionType === 'deposit') {
                    // Check main account has sufficient balance
                    if ($account['balance'] < $amount) {
                        throw new Exception("Insufficient balance in main account");
                    }
                    $newPlanAmount += $amount;
                    $newAccountBalance -= $amount;
                } else if ($transactionType === 'withdrawal') {
                    // Check plan has sufficient balance
                    if ($plan['current_amount'] < $amount) {
                        throw new Exception("Insufficient balance in savings plan");
                    }
                    $newPlanAmount -= $amount;
                    $newAccountBalance += $amount;
                }

                // Update plan
                $updatePlanQuery = "UPDATE savings_plans SET current_amount = ?, status = ?, updated_at = NOW() WHERE id = ?";
                $status = ($newPlanAmount >= $plan['target_amount']) ? 'completed' : $plan['status'];
                $updatePlanStmt = $conn->prepare($updatePlanQuery);
                $updatePlanStmt->bind_param("dsi", $newPlanAmount, $status, $planId);
                $updatePlanStmt->execute();

                // Update account
                $updateAccountQuery = "UPDATE accounts SET balance = ?, updated_at = NOW() WHERE id = ?";
                $updateAccountStmt = $conn->prepare($updateAccountQuery);
                $updateAccountStmt->bind_param("di", $newAccountBalance, $account['id']);
                $updateAccountStmt->execute();

                // Record savings transaction
                $savingsTransQuery = "INSERT INTO savings_transactions (plan_id, user_id, amount, transaction_type, notes) VALUES (?, ?, ?, ?, ?)";
                $savingsTransStmt = $conn->prepare($savingsTransQuery);
                $savingsTransStmt->bind_param("iidss", $planId, $userId, $amount, $transactionType, $notes);
                $savingsTransStmt->execute();

                // Record main transaction
                $transType = $transactionType === 'deposit' ? 'debit' : 'credit';
                $transQuery = "INSERT INTO transactions (user_id, account_id, type, category, amount, description) VALUES (?, ?, ?, ?, ?, ?)";
                $transStmt = $conn->prepare($transQuery);
                $category = 'Savings';
                $description = "Savings plan: {$plan['plan_name']}";
                $transStmt->bind_param("iissds", $userId, $account['id'], $transType, $category, $amount, $description);
                $transStmt->execute();

                $conn->commit();

                sendResponse(true, [
                    'new_plan_amount' => $newPlanAmount,
                    'new_account_balance' => $newAccountBalance,
                    'plan_status' => $status
                ], 'Savings transaction completed successfully');

            } catch (Exception $e) {
                $conn->rollback();
                sendResponse(false, null, $e->getMessage(), 400);
            }
        } else {
            // Update plan details
            $updates = [];
            $params = [];
            $types = "";

            if (isset($data['plan_name'])) {
                $updates[] = "plan_name = ?";
                $params[] = $data['plan_name'];
                $types .= "s";
            }
            if (isset($data['target_amount'])) {
                $updates[] = "target_amount = ?";
                $params[] = floatval($data['target_amount']);
                $types .= "d";
            }
            if (isset($data['status'])) {
                $updates[] = "status = ?";
                $params[] = $data['status'];
                $types .= "s";
            }
            if (isset($data['auto_save'])) {
                $updates[] = "auto_save = ?";
                $params[] = intval($data['auto_save']);
                $types .= "i";
            }

            if (empty($updates)) {
                sendResponse(false, null, 'No fields to update', 400);
            }

            $updates[] = "updated_at = NOW()";
            $params[] = $planId;
            $params[] = $userId;
            $types .= "ii";

            $query = "UPDATE savings_plans SET " . implode(", ", $updates) . " WHERE id = ? AND user_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param($types, ...$params);

            if ($stmt->execute()) {
                sendResponse(true, null, 'Savings plan updated successfully');
            } else {
                sendResponse(false, null, 'Failed to update savings plan', 400);
            }
        }
        break;

    case 'DELETE':
        // Delete savings plan
        $planId = $_GET['id'] ?? null;
        
        if (!$planId) {
            sendResponse(false, null, 'Plan ID required', 400);
        }

        // In production, you might want to return the money to main account before deleting
        $query = "DELETE FROM savings_plans WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $planId, $userId);
        
        if ($stmt->execute()) {
            sendResponse(true, null, 'Savings plan deleted successfully');
        } else {
            sendResponse(false, null, 'Failed to delete savings plan', 400);
        }
        break;

    default:
        sendResponse(false, null, 'Method not allowed', 405);
        break;
}

$db->disconnect();
?>
