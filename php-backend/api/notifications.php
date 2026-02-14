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
        // Get notifications for user
        $unreadOnly = isset($_GET['unread_only']) && $_GET['unread_only'] === 'true';
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
        
        $query = "SELECT * FROM notifications WHERE user_id = ?";
        $params = [$userId];
        $types = "i";
        
        if ($unreadOnly) {
            $query .= " AND is_read = 0";
        }
        
        $query .= " ORDER BY created_at DESC LIMIT ?";
        $params[] = $limit;
        $types .= "i";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $notifications = [];
        $unreadCount = 0;
        
        while ($row = $result->fetch_assoc()) {
            if (!$row['is_read']) {
                $unreadCount++;
            }
            $notifications[] = $row;
        }
        
        sendResponse(true, [
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ], 'Notifications retrieved successfully');
        break;

    case 'POST':
        // Create notification (typically called by system, not users)
        $data = getPostData();
        $missing = validateRequired($data, ['title', 'message', 'type']);
        
        if (!empty($missing)) {
            sendResponse(false, null, 'Missing fields: ' . implode(', ', $missing), 400);
        }

        $title = $data['title'];
        $message = $data['message'];
        $type = $data['type'];
        $actionUrl = $data['action_url'] ?? null;

        $query = "INSERT INTO notifications (user_id, title, message, type, action_url) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("issss", $userId, $title, $message, $type, $actionUrl);
        
        if ($stmt->execute()) {
            $notificationId = $stmt->insert_id;
            sendResponse(true, ['notification_id' => $notificationId], 'Notification created successfully', 201);
        } else {
            sendResponse(false, null, 'Failed to create notification', 400);
        }
        break;

    case 'PUT':
        // Mark notification(s) as read
        $data = getPostData();
        
        if (isset($data['notification_id'])) {
            // Mark single notification as read
            $notificationId = $data['notification_id'];
            $query = "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ii", $notificationId, $userId);
            
            if ($stmt->execute()) {
                sendResponse(true, null, 'Notification marked as read');
            } else {
                sendResponse(false, null, 'Failed to update notification', 400);
            }
        } else if (isset($data['mark_all_read']) && $data['mark_all_read']) {
            // Mark all notifications as read
            $query = "UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $userId);
            
            if ($stmt->execute()) {
                sendResponse(true, null, 'All notifications marked as read');
            } else {
                sendResponse(false, null, 'Failed to update notifications', 400);
            }
        } else {
            sendResponse(false, null, 'Invalid request', 400);
        }
        break;

    case 'DELETE':
        // Delete notification
        $notificationId = $_GET['id'] ?? null;
        
        if (!$notificationId) {
            sendResponse(false, null, 'Notification ID required', 400);
        }

        $query = "DELETE FROM notifications WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $notificationId, $userId);
        
        if ($stmt->execute()) {
            sendResponse(true, null, 'Notification deleted successfully');
        } else {
            sendResponse(false, null, 'Failed to delete notification', 400);
        }
        break;

    default:
        sendResponse(false, null, 'Method not allowed', 405);
        break;
}

$db->disconnect();
?>
