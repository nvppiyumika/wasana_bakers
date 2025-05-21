<?php
require '../db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$first_name = $data['first_name'] ?? '';
$last_name = $data['last_name'] ?? '';
$address = $data['address'] ?? '';
$phone = $data['phone'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$confirm_password = $data['confirm_password'] ?? '';

if ($password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match.']);
    exit;
}

// Check if email already exists
$stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered.']);
    exit;
}
$stmt->close();

$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare('INSERT INTO users (first_name, last_name, address, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->bind_param('ssssss', $first_name, $last_name, $address, $phone, $email, $hashed_password);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful. Please log in.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed.']);
}
$stmt->close();
$conn->close();
