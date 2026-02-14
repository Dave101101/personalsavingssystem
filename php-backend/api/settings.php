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
        // Get user settings
        $query = "SELECT setting_key, setting_value FROM user_settings WHERE user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $settings = [];
        while ($row = $result->fetch_assoc()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        
        // Return default settings if none exist
        if (empty($settings)) {
            $settings = [
                'notifications_enabled' => 'true',
                'email_alerts' => 'true',
                'push_notifications' => 'true',
                'biometric_auth' => 'false',
                'auto_save' => 'false',
                'dark_mode' => 'true',
                'currency' => 'NGN',
                'language' => 'en'
            ];
        }
        
        sendResponse(true, $settings, 'Settings retrieved successfully');
        break;

    case 'POST':
    case 'PUT':
        // Update user settings
        $data = getPostData();
        
        if (empty($data)) {
            sendResponse(false, null, 'No settings to update', 400);
        }

        $conn->begin_transaction();

        try {
            foreach ($data as $key => $value) {
                // Convert boolean to string
                $valueStr = is_bool($value) ? ($value ? 'true' : 'false') : $value;
                
                $query = "INSERT INTO user_settings (user_id, setting_key, setting_value) 
                          VALUES (?, ?, ?) 
                          ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = NOW()";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("isss", $userId, $key, $valueStr, $valueStr);
                $stmt->execute();
            }

            $conn->commit();
            sendResponse(true, null, 'Settings updated successfully');

        } catch (Exception $e) {
            $conn->rollback();
            sendResponse(false, null, $e->getMessage(), 400);
        }
        break;

    case 'DELETE':
        // Reset all settings to default
        $query = "DELETE FROM user_settings WHERE user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $userId);
        
        if ($stmt->execute()) {
            sendResponse(true, null, 'Settings reset successfully');
        } else {
            sendResponse(false, null, 'Failed to reset settings', 400);
        }
        break;

    default:
        sendResponse(false, null, 'Method not allowed', 405);
        break;
}

$db->disconnect();
?>
