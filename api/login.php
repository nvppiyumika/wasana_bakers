<?php
session_start();
require '../db.php';

header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$type = isset($data['type']) ? $data['type'] : '';
$username_email = isset($data['username_email']) ? $data['username_email'] : '';
$password = isset($data['password']) ? $data['password'] : '';

if ($type === 'user') {
    // Only allow login by email (case-insensitive)
    $stmt = $conn->prepare('SELECT id, password FROM users WHERE LOWER(email) = LOWER(?)');
    $stmt->bind_param('s', $username_email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 1) {
        $stmt->bind_result($user_id, $hashed_password);
        $stmt->fetch();
        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $user_id;
            echo json_encode(['success' => true, 'message' => 'User login successful.']);
            exit;
        }
    }
    echo json_encode(['success' => false, 'message' => 'Invalid user credentials.']);
    exit;
} elseif ($type === 'admin') {
    $stmt = $conn->prepare('SELECT id, password FROM admins WHERE email = ? OR username = ?');
    $stmt->bind_param('ss', $username_email, $username_email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 1) {
        $stmt->bind_result($admin_id, $hashed_password);
        $stmt->fetch();
        if (password_verify($password, $hashed_password)) {
            $_SESSION['admin_id'] = $admin_id;
            echo json_encode(['success' => true, 'message' => 'Admin login successful.']);
            exit;
        }
    }
    echo json_encode(['success' => false, 'message' => 'Invalid admin credentials.']);
    exit;
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid login type.']);
    exit;
}
