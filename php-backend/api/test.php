<?php
require_once '../config.php';

$db = new Database();
$conn = $db->connect();

if (!$conn) {
    sendResponse(false, null, 'Database connection failed', 500);
}

// Test query
$query = "SELECT VERSION() as mysql_version, DATABASE() as database_name";
$result = $conn->query($query);
$info = $result->fetch_assoc();

// Get table count
$tableQuery = "SELECT COUNT(*) as table_count FROM information_schema.tables 
               WHERE table_schema = '" . DB_NAME . "'";
$tableResult = $conn->query($tableQuery);
$tableInfo = $tableResult->fetch_assoc();

sendResponse(true, [
    'message' => 'Backend connection successful!',
    'mysql_version' => $info['mysql_version'],
    'database' => $info['database_name'],
    'tables' => (int)$tableInfo['table_count'],
    'php_version' => phpversion(),
    'server_time' => date('Y-m-d H:i:s')
], 'Backend is working correctly!');

$db->disconnect();
?>
