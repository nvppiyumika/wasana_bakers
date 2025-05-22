<?php
require_once 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT id, user_id, status, subtotal, shipping, total, created_at, items FROM OrderSummary");
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch orders: ' . $e->getMessage()]);
}
?>