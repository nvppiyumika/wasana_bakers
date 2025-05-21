<?php
header('Content-Type: application/json');
include 'config.php';

try {
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = $input['user_id'] ?? '';
    $first_name = $input['first_name'] ?? '';
    $last_name = $input['last_name'] ?? '';
    $address = $input['address'] ?? '';
    $phone = $input['phone'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($user_id) || !is_numeric($user_id)) {
        throw new Exception('Invalid or missing user_id');
    }
    if (empty($first_name)) {
        throw new Exception('First name is required');
    }
    if (empty($last_name)) {
        throw new Exception('Last name is required');
    }
    if (empty($address)) {
        throw new Exception('Address is required');
    }
    if (empty($phone)) {
        throw new Exception('Phone is required');
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Valid email is required');
    }

    $query = "UPDATE users SET first_name = ?, last_name = ?, address = ?, phone = ?, email = ?";
    $params = [$first_name, $last_name, $address, $phone, $email];

    if (!empty($password)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $query .= ", password = ?";
        $params[] = $hashed_password;
    }

    $query .= " WHERE id = ?";
    $params[] = $user_id;

    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    if ($stmt->rowCount() === 0) {
        throw new Exception('No user found with the specified ID or no changes made');
    }

    echo json_encode(['success' => true, 'message' => 'User updated successfully']);
} catch (PDOException $e) {
    error_log('Database error in update-user.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in update-user.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>