<?php
header('Content-Type: application/json');
include 'config.php';

try {
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = $input['user_id'] ?? '';
    error_log('Delete User Input: ' . json_encode($input));

    if (empty($user_id) || !is_numeric($user_id)) {
        throw new Exception('Invalid or missing user_id');
    }

    $query = "DELETE FROM users WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$user_id]);

    if ($stmt->rowCount() === 0) {
        throw new Exception('No user found with the specified ID');
    }

    echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
} catch (PDOException $e) {
    error_log('Database error in delete-user.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in delete-user.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>