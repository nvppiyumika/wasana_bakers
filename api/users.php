<?php
header('Content-Type: application/json');
include 'config.php';

try {
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    $user_id = isset($_GET['id']) ? $_GET['id'] : null;

    if ($user_id && is_numeric($user_id)) {
        $query = "SELECT id, first_name, last_name, email, address, phone FROM users WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            throw new Exception('User not found');
        }

        echo json_encode($user);
    } else {
        $query = "SELECT id, first_name, last_name, email FROM users";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($users);
    }
} catch (PDOException $e) {
    error_log('Database error in users.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in users.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>