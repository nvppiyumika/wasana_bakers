<?php
session_start();
header('Content-Type: application/json');

// Destroy session and clear cart on logout
if (isset($_SESSION['user_id'])) {
    require '../db.php';
    $user_id = $_SESSION['user_id'];
    $conn->query("DELETE FROM cart_items WHERE user_id = $user_id");
}
session_unset();
session_destroy();
echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
