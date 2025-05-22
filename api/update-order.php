<?php
require_once 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$order_id = $input['order_id'] ?? '';
$status = $input['status'] ?? '';

if (empty($order_id) || empty($status)) {
    echo json_encode(['success' => false, 'message' => 'Order ID and status are required']);
    exit();
}

try {
    $stmt = $conn->prepare("UPDATE orders SET status = :status WHERE id = :id");
    $stmt->execute(['status' => $status, 'id' => $order_id]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Order status updated']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Order not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to update order: ' . $e->getMessage()]);
}
?>