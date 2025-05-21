<?php
session_start();
header('Content-Type: application/json');
include 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    // Fetch orders with their items, including total and created_at
    $stmt = $conn->prepare("
        SELECT o.id, o.user_id, o.total, o.shipping, o.status, o.created_at,
               oi.product_id, oi.quantity, oi.price, p.name
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        ORDER BY o.id DESC
    ");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $orders = [];
    $currentOrderId = null;
    $currentOrder = null;

    foreach ($results as $row) {
        if ($row['id'] !== $currentOrderId) {
            if ($currentOrder !== null) {
                $orders[] = $currentOrder;
            }
            $currentOrderId = $row['id'];
            $currentOrder = [
                'id' => $row['id'],
                'user_id' => $row['user_id'],
                'total' => (float)$row['total'], // Ensure numeric format
                'shipping' => (float)$row['shipping'],
                'status' => $row['status'],
                'created_at' => $row['created_at'], // e.g., "2025-05-20 10:30:00"
                'items' => []
            ];
        }
        if ($row['product_id']) {
            $currentOrder['items'][] = [
                'product_id' => $row['product_id'],
                'quantity' => (int)$row['quantity'],
                'price' => (float)$row['price'],
                'name' => $row['name']
            ];
        }
    }
    if ($currentOrder !== null) {
        $orders[] = $currentOrder;
    }

    echo json_encode($orders);
} catch (PDOException $e) {
    error_log('Database error in orders.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in orders.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>