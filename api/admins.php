<?php
header('Content-Type: application/json');
include 'config.php';

try {
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    $admin_id = isset($_GET['id']) ? $_GET['id'] : null;

    if ($admin_id && is_numeric($admin_id)) {
        $query = "SELECT id, username, email FROM admins WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$admin_id]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$admin) {
            throw new Exception('Admin not found');
        }

        echo json_encode($admin);
    } else {
        $query = "SELECT id, username, email FROM admins";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($admins);
    }
} catch (PDOException $e) {
    error_log('Database error in admins.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in admins.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>