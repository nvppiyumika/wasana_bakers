<?php
header('Content-Type: application/json');
include 'config.php';

try {
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $admin_id = $input['admin_id'] ?? '';
    error_log('Delete Admin Input: ' . json_encode($input));

    if (empty($admin_id) || !is_numeric($admin_id)) {
        throw new Exception('Invalid or missing admin_id');
    }

    $query = "DELETE FROM admins WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$admin_id]);

    if ($stmt->rowCount() === 0) {
        throw new Exception('No admin found with the specified ID');
    }

    echo json_encode(['success' => true, 'message' => 'Admin deleted successfully']);
} catch (PDOException $e) {
    error_log('Database error in delete-admin.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in delete-admin.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>