<?php
require_once 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$order_id = $input['order_id'] ?? '';

if (empty($order_id)) {
    echo json_encode(['success' => false, 'message' => 'Order ID is required']);
    exit();
}

try {
    $conn->beginTransaction();
    $stmt = $conn->prepare("DELETE FROM order_items WHERE order_id = :id");
    $stmt->execute(['id' => $order_id]);
    $stmt = $conn->prepare("DELETE FROM orders WHERE id = :id");
    $stmt->execute(['id' => $order_id]);
    $conn->commit();
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Order deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Order not found']);
    }
} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'message' => 'Failed to delete order: ' . $e->getMessage()]);
}
?>