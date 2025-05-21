<?php
session_start();
header('Content-Type: application/json');
include 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'user') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Please log in to checkout']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $items = $input['items'] ?? [];
    $subtotal = floatval($input['subtotal'] ?? 0);
    $shipping = floatval($input['shipping'] ?? 200);
    $total = floatval($input['total'] ?? 0);

    if (empty($items)) {
        throw new Exception('Cart is empty');
    }

    if ($subtotal <= 0 || $total <= 0) {
        throw new Exception('Invalid cart total');
    }

    // Validate product_ids
    $stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
    foreach ($items as $item) {
        $stmt->execute([$item['product_id']]);
        if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
            throw new Exception("Invalid product ID: {$item['product_id']}");
        }
    }

    $conn->beginTransaction();

    // Insert order
    $stmt = $conn->prepare("INSERT INTO orders (user_id, total, shipping, status) VALUES (?, ?, ?, 'pending')");
    $stmt->execute([$user_id, $total, $shipping]);
    $order_id = $conn->lastInsertId();

    // Insert order items
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    foreach ($items as $item) {
        $stmt->execute([$order_id, $item['product_id'], $item['quantity'], $item['price']]);
    }

    // Clear cart
    $stmt = $conn->prepare("DELETE FROM cart_items WHERE user_id = ?");
    $stmt->execute([$user_id]);

    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Order placed successfully']);
} catch (PDOException $e) {
    $conn->rollBack();
    error_log('Database error in checkout.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    $conn->rollBack();
    error_log('General error in checkout.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>