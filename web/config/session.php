<?php
session_start();

// Database configuration (using the same as backend API)
define('DB_HOST', 'localhost');
define('DB_USER', 'your_database_username');
define('DB_PASS', 'your_database_password');
define('DB_NAME', 'first_groups_accounting');

// Default user ID (in production, get from session after login)
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1; // Default user: Ibukun Diamond Great Tola
}

// Database connection
function getDB() {
    static $conn = null;
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        $conn->set_charset("utf8mb4");
    }
    return $conn;
}

// Get current user data
function getCurrentUser() {
    $conn = getDB();
    $userId = $_SESSION['user_id'];
    
    $query = "SELECT u.*, 
              (SELECT balance FROM accounts WHERE user_id = u.id AND account_type = 'main') as main_balance,
              (SELECT balance FROM accounts WHERE user_id = u.id AND account_type = 'stash') as stash_balance
              FROM users u WHERE u.id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_assoc();
}

// Format currency
function formatCurrency($amount) {
    return '₦' . number_format($amount, 2);
}
?>
