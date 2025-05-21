<?php
session_start();
header('Content-Type: application/json');
include 'config.php';
error_log("Session data: " . print_r($_SESSION, true));

if (!isset($_SESSION['user_id']) || !isset($_SESSION['type'])) {
    echo json_encode(['loggedIn' => false]);
    exit;
}

try {
    $type = $_SESSION['type'];
    $user_id = $_SESSION['user_id'];
    if ($type === 'admin') {
        $stmt = $conn->prepare("SELECT username FROM admins WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $display_name = $user['username'] ?? '';
    } else {
        $stmt = $conn->prepare("SELECT first_name FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $display_name = $user['first_name'] ?? '';
    }

    if ($display_name) {
        echo json_encode(['loggedIn' => true, 'display_name' => $display_name, 'type' => $type]);
    } else {
        echo json_encode(['loggedIn' => false]);
    }
} catch (PDOException $e) {
    error_log("PDO Error: " . $e->getMessage());
    echo json_encode(['loggedIn' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>