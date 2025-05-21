<?php
header('Content-Type: application/json');
include 'config.php';

try {
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $admin_id = $input['admin_id'] ?? '';
    $username = $input['username'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($admin_id) || !is_numeric($admin_id)) {
        throw new Exception('Invalid or missing admin_id');
    }
    if (empty($username)) {
        throw new Exception('Username is required');
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Valid email is required');
    }

    $query = "UPDATE admins SET username = ?, email = ?";
    $params = [$username, $email];

    if (!empty($password)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $query .= ", password = ?";
        $params[] = $hashed_password;
    }

    $query .= " WHERE id = ?";
    $params[] = $admin_id;

    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    if ($stmt->rowCount() === 0) {
        throw new Exception('No admin found with the specified ID or no changes made');
    }

    echo json_encode(['success' => true, 'message' => 'Admin updated successfully']);
} catch (PDOException $e) {
    error_log('Database error in update-admin.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in update-admin.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>