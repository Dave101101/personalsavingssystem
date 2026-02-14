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
        // Get all circles or specific circle details
        $circleId = $_GET['id'] ?? null;
        $filter = $_GET['filter'] ?? 'all'; // all, my-circles, public
        
        if ($circleId) {
            // Get specific circle with member details
            $query = "SELECT c.*, u.name as creator_name 
                      FROM circles c 
                      LEFT JOIN users u ON c.creator_id = u.id 
                      WHERE c.id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $circleId);
            $stmt->execute();
            $result = $stmt->get_result();
            $circle = $result->fetch_assoc();
            
            if ($circle) {
                // Get members
                $memberQuery = "SELECT cm.*, u.name, u.avatar_url 
                                FROM circle_members cm 
                                LEFT JOIN users u ON cm.user_id = u.id 
                                WHERE cm.circle_id = ? AND cm.status = 'active'";
                $memberStmt = $conn->prepare($memberQuery);
                $memberStmt->bind_param("i", $circleId);
                $memberStmt->execute();
                $memberResult = $memberStmt->get_result();
                
                $members = [];
                while ($member = $memberResult->fetch_assoc()) {
                    $members[] = $member;
                }
                
                $circle['members'] = $members;
                $circle['progress'] = $circle['target_amount'] > 0 ? ($circle['current_amount'] / $circle['target_amount']) * 100 : 0;
                
                sendResponse(true, $circle, 'Circle details retrieved successfully');
            } else {
                sendResponse(false, null, 'Circle not found', 404);
            }
        } else {
            // Get all circles based on filter
            $query = "SELECT c.*, u.name as creator_name 
                      FROM circles c 
                      LEFT JOIN users u ON c.creator_id = u.id 
                      WHERE 1=1";
            
            $params = [];
            $types = "";
            
            if ($filter === 'my-circles') {
                $query .= " AND (c.creator_id = ? OR c.id IN (SELECT circle_id FROM circle_members WHERE user_id = ? AND status = 'active'))";
                $params[] = $userId;
                $params[] = $userId;
                $types .= "ii";
            } else if ($filter === 'public') {
                $query .= " AND c.is_public = 1 AND c.status = 'active'";
            }
            
            $query .= " ORDER BY c.created_at DESC";
            
            $stmt = $conn->prepare($query);
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }
            $stmt->execute();
            $result = $stmt->get_result();
            
            $circles = [];
            while ($row = $result->fetch_assoc()) {
                $row['progress'] = $row['target_amount'] > 0 ? ($row['current_amount'] / $row['target_amount']) * 100 : 0;
                $circles[] = $row;
            }
            
            sendResponse(true, $circles, 'Circles retrieved successfully');
        }
        break;

    case 'POST':
        // Create new circle
        $data = getPostData();
        $missing = validateRequired($data, ['circle_name', 'target_amount']);
        
        if (!empty($missing)) {
            sendResponse(false, null, 'Missing fields: ' . implode(', ', $missing), 400);
        }

        $circleName = $data['circle_name'];
        $description = $data['description'] ?? '';
        $targetAmount = floatval($data['target_amount']);
        $maxMembers = isset($data['max_members']) ? intval($data['max_members']) : null;
        $isPublic = isset($data['is_public']) ? intval($data['is_public']) : 1;
        $category = $data['category'] ?? 'General';
        $icon = $data['icon'] ?? 'users';

        $conn->begin_transaction();

        try {
            // Create circle
            $query = "INSERT INTO circles (creator_id, circle_name, description, target_amount, max_members, is_public, category, icon) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("issdiiss", $userId, $circleName, $description, $targetAmount, $maxMembers, $isPublic, $category, $icon);
            $stmt->execute();
            
            $circleId = $stmt->insert_id;

            // Add creator as first member
            $memberQuery = "INSERT INTO circle_members (circle_id, user_id) VALUES (?, ?)";
            $memberStmt = $conn->prepare($memberQuery);
            $memberStmt->bind_param("ii", $circleId, $userId);
            $memberStmt->execute();

            $conn->commit();

            sendResponse(true, ['circle_id' => $circleId], 'Circle created successfully', 201);

        } catch (Exception $e) {
            $conn->rollback();
            sendResponse(false, null, $e->getMessage(), 400);
        }
        break;

    case 'PUT':
        // Update circle or handle member actions (join, contribute)
        $data = getPostData();
        $circleId = $data['circle_id'] ?? null;
        
        if (!$circleId) {
            sendResponse(false, null, 'Circle ID required', 400);
        }

        // Check if this is a join action
        if (isset($data['action']) && $data['action'] === 'join') {
            $conn->begin_transaction();

            try {
                // Check if circle exists and has space
                $circleQuery = "SELECT * FROM circles WHERE id = ? AND status = 'active' FOR UPDATE";
                $circleStmt = $conn->prepare($circleQuery);
                $circleStmt->bind_param("i", $circleId);
                $circleStmt->execute();
                $circleResult = $circleStmt->get_result();
                $circle = $circleResult->fetch_assoc();

                if (!$circle) {
                    throw new Exception("Circle not found or inactive");
                }

                if ($circle['max_members'] && $circle['member_count'] >= $circle['max_members']) {
                    throw new Exception("Circle is full");
                }

                // Check if user is already a member
                $checkQuery = "SELECT id FROM circle_members WHERE circle_id = ? AND user_id = ? AND status = 'active'";
                $checkStmt = $conn->prepare($checkQuery);
                $checkStmt->bind_param("ii", $circleId, $userId);
                $checkStmt->execute();
                $checkResult = $checkStmt->get_result();

                if ($checkResult->num_rows > 0) {
                    throw new Exception("Already a member of this circle");
                }

                // Add member
                $memberQuery = "INSERT INTO circle_members (circle_id, user_id) VALUES (?, ?)";
                $memberStmt = $conn->prepare($memberQuery);
                $memberStmt->bind_param("ii", $circleId, $userId);
                $memberStmt->execute();

                // Update member count
                $updateQuery = "UPDATE circles SET member_count = member_count + 1, updated_at = NOW() WHERE id = ?";
                $updateStmt = $conn->prepare($updateQuery);
                $updateStmt->bind_param("i", $circleId);
                $updateStmt->execute();

                $conn->commit();

                sendResponse(true, null, 'Successfully joined circle');

            } catch (Exception $e) {
                $conn->rollback();
                sendResponse(false, null, $e->getMessage(), 400);
            }
        }
        // Check if this is a contribute action
        else if (isset($data['action']) && $data['action'] === 'contribute') {
            $amount = floatval($data['amount']);

            $conn->begin_transaction();

            try {
                // Check member and account balances
                $memberQuery = "SELECT * FROM circle_members WHERE circle_id = ? AND user_id = ? AND status = 'active' FOR UPDATE";
                $memberStmt = $conn->prepare($memberQuery);
                $memberStmt->bind_param("ii", $circleId, $userId);
                $memberStmt->execute();
                $memberResult = $memberStmt->get_result();
                $member = $memberResult->fetch_assoc();

                if (!$member) {
                    throw new Exception("Not a member of this circle");
                }

                $accountQuery = "SELECT id, balance FROM accounts WHERE user_id = ? AND account_type = 'main' FOR UPDATE";
                $accountStmt = $conn->prepare($accountQuery);
                $accountStmt->bind_param("i", $userId);
                $accountStmt->execute();
                $accountResult = $accountStmt->get_result();
                $account = $accountResult->fetch_assoc();

                if ($account['balance'] < $amount) {
                    throw new Exception("Insufficient balance");
                }

                // Update member contribution
                $updateMemberQuery = "UPDATE circle_members SET contribution_amount = contribution_amount + ? WHERE id = ?";
                $updateMemberStmt = $conn->prepare($updateMemberQuery);
                $updateMemberStmt->bind_param("di", $amount, $member['id']);
                $updateMemberStmt->execute();

                // Update circle total
                $circleQuery = "SELECT * FROM circles WHERE id = ? FOR UPDATE";
                $circleStmt = $conn->prepare($circleQuery);
                $circleStmt->bind_param("i", $circleId);
                $circleStmt->execute();
                $circleResult = $circleStmt->get_result();
                $circle = $circleResult->fetch_assoc();

                $newCircleAmount = $circle['current_amount'] + $amount;
                $status = ($newCircleAmount >= $circle['target_amount']) ? 'completed' : $circle['status'];

                $updateCircleQuery = "UPDATE circles SET current_amount = ?, status = ?, updated_at = NOW() WHERE id = ?";
                $updateCircleStmt = $conn->prepare($updateCircleQuery);
                $updateCircleStmt->bind_param("dsi", $newCircleAmount, $status, $circleId);
                $updateCircleStmt->execute();

                // Update account balance
                $newBalance = $account['balance'] - $amount;
                $updateAccountQuery = "UPDATE accounts SET balance = ?, updated_at = NOW() WHERE id = ?";
                $updateAccountStmt = $conn->prepare($updateAccountQuery);
                $updateAccountStmt->bind_param("di", $newBalance, $account['id']);
                $updateAccountStmt->execute();

                // Record transaction
                $transQuery = "INSERT INTO transactions (user_id, account_id, type, category, amount, description) VALUES (?, ?, 'debit', 'Circle', ?, ?)";
                $transStmt = $conn->prepare($transQuery);
                $description = "Contribution to circle: {$circle['circle_name']}";
                $transStmt->bind_param("iids", $userId, $account['id'], $amount, $description);
                $transStmt->execute();

                $conn->commit();

                sendResponse(true, [
                    'new_contribution' => $member['contribution_amount'] + $amount,
                    'new_circle_amount' => $newCircleAmount,
                    'new_balance' => $newBalance,
                    'circle_status' => $status
                ], 'Contribution successful');

            } catch (Exception $e) {
                $conn->rollback();
                sendResponse(false, null, $e->getMessage(), 400);
            }
        }
        // Update circle details
        else {
            $updates = [];
            $params = [];
            $types = "";

            if (isset($data['circle_name'])) {
                $updates[] = "circle_name = ?";
                $params[] = $data['circle_name'];
                $types .= "s";
            }
            if (isset($data['description'])) {
                $updates[] = "description = ?";
                $params[] = $data['description'];
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
            $params[] = $circleId;
            $params[] = $userId;
            $types .= "ii";

            $query = "UPDATE circles SET " . implode(", ", $updates) . " WHERE id = ? AND creator_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param($types, ...$params);

            if ($stmt->execute()) {
                sendResponse(true, null, 'Circle updated successfully');
            } else {
                sendResponse(false, null, 'Failed to update circle', 400);
            }
        }
        break;

    case 'DELETE':
        // Leave or delete circle
        $circleId = $_GET['id'] ?? null;
        
        if (!$circleId) {
            sendResponse(false, null, 'Circle ID required', 400);
        }

        // Check if user is creator
        $checkQuery = "SELECT creator_id FROM circles WHERE id = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bind_param("i", $circleId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        $circle = $checkResult->fetch_assoc();

        if ($circle && $circle['creator_id'] == $userId) {
            // Delete circle (only creator can do this)
            $query = "DELETE FROM circles WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $circleId);
            
            if ($stmt->execute()) {
                sendResponse(true, null, 'Circle deleted successfully');
            } else {
                sendResponse(false, null, 'Failed to delete circle', 400);
            }
        } else {
            // Leave circle
            $query = "UPDATE circle_members SET status = 'left' WHERE circle_id = ? AND user_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ii", $circleId, $userId);
            
            if ($stmt->execute()) {
                // Update member count
                $updateQuery = "UPDATE circles SET member_count = member_count - 1 WHERE id = ?";
                $updateStmt = $conn->prepare($updateQuery);
                $updateStmt->bind_param("i", $circleId);
                $updateStmt->execute();
                
                sendResponse(true, null, 'Left circle successfully');
            } else {
                sendResponse(false, null, 'Failed to leave circle', 400);
            }
        }
        break;

    default:
        sendResponse(false, null, 'Method not allowed', 405);
        break;
}

$db->disconnect();
?>
