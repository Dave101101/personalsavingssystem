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
        // Get user profile
        $query = "SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.created_at,
                         (SELECT balance FROM accounts WHERE user_id = u.id AND account_type = 'main') as main_balance,
                         (SELECT balance FROM accounts WHERE user_id = u.id AND account_type = 'stash') as stash_balance
                  FROM users u 
                  WHERE u.id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if ($user) {
            // Get additional stats
            $statsQuery = "SELECT 
                           (SELECT COUNT(*) FROM savings_plans WHERE user_id = ? AND status = 'active') as active_plans,
                           (SELECT COUNT(*) FROM circle_members WHERE user_id = ? AND status = 'active') as active_circles,
                           (SELECT COUNT(*) FROM investments WHERE user_id = ? AND status = 'active') as active_investments";
            $statsStmt = $conn->prepare($statsQuery);
            $statsStmt->bind_param("iii", $userId, $userId, $userId);
            $statsStmt->execute();
            $statsResult = $statsStmt->get_result();
            $stats = $statsResult->fetch_assoc();
            
            $user['stats'] = $stats;
            
            sendResponse(true, $user, 'User profile retrieved successfully');
        } else {
            sendResponse(false, null, 'User not found', 404);
        }
        break;

    case 'PUT':
        // Update user profile
        $data = getPostData();
        
        $updates = [];
        $params = [];
        $types = "";

        if (isset($data['name'])) {
            $updates[] = "name = ?";
            $params[] = $data['name'];
            $types .= "s";
        }
        if (isset($data['email'])) {
            $updates[] = "email = ?";
            $params[] = $data['email'];
            $types .= "s";
        }
        if (isset($data['phone'])) {
            $updates[] = "phone = ?";
            $params[] = $data['phone'];
            $types .= "s";
        }
        if (isset($data['avatar_url'])) {
            $updates[] = "avatar_url = ?";
            $params[] = $data['avatar_url'];
            $types .= "s";
        }

        if (empty($updates)) {
            sendResponse(false, null, 'No fields to update', 400);
        }

        $updates[] = "updated_at = NOW()";
        $params[] = $userId;
        $types .= "i";

        $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            sendResponse(true, null, 'Profile updated successfully');
        } else {
            sendResponse(false, null, 'Failed to update profile', 400);
        }
        break;

    default:
        sendResponse(false, null, 'Method not allowed', 405);
        break;
}

$db->disconnect();
?>
