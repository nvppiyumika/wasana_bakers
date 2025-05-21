<?php
session_start();
header('Content-Type: application/json');
include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$username_email = $data['username_email'] ?? '';
$password = $data['password'] ?? '';
$type = $data['type'] ?? '';

if (empty($username_email) || empty($password) || empty($type)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

try {
    $table = ($type === 'admin') ? 'admins' : 'users';
    if ($type === 'admin') {
        $stmt = $conn->prepare("SELECT id, username, password FROM admins WHERE email = ? OR username = ?");
        $stmt->execute([$username_email, $username_email]);
    } else {
        $stmt = $conn->prepare("SELECT id, first_name, password FROM users WHERE email = ?");
        $stmt->execute([$username_email]);
    }
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['type'] = $type;
        $display_name = ($type === 'admin') ? $user['username'] : $user['first_name'];
        error_log("Session set: user_id={$_SESSION['user_id']}, type={$_SESSION['type']}, display_name=$display_name");
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'display_name' => $display_name
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
} catch (PDOException $e) {
    error_log("PDO Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>