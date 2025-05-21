<?php
session_start();
header('Content-Type: application/json');
include 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'user') {
    echo json_encode(['success' => false, 'message' => 'Please log in to manage cart']);
    exit;
}

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

try {
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    if ($method === 'POST') {
        // Add to cart
        $data = json_decode(file_get_contents('php://input'), true);
        $product_id = $data['product_id'] ?? '';
        $quantity = $data['quantity'] ?? 1;

        if (empty($product_id)) {
            throw new Exception('Product ID required');
        }

        // Check if product exists
        $stmt = $conn->prepare("SELECT id, availability FROM products WHERE id = ?");
        $stmt->execute([$product_id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product || $product['availability'] === 'out_of_stock') {
            throw new Exception('Product not available');
        }

        // Check if item already in cart
        $stmt = $conn->prepare("SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$user_id, $product_id]);
        $cart_item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart_item) {
            // Update quantity
            $new_quantity = $cart_item['quantity'] + $quantity;
            $stmt = $conn->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?");
            $stmt->execute([$new_quantity, $cart_item['id']]);
        } else {
            // Insert new item
            $stmt = $conn->prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)");
            $stmt->execute([$user_id, $product_id, $quantity]);
        }

        echo json_encode(['success' => true, 'message' => 'Item added to cart']);
    } elseif ($method === 'GET') {
        // View cart
        $stmt = $conn->prepare("
            SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.image
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        ");
        $stmt->execute([$user_id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($items as &$item) {
            if ($item['image'] && is_string($item['image']) && strlen($item['image']) > 0) {
                $encoded = base64_encode($item['image']);
                if ($encoded === false) {
                    throw new Exception('Base64 encoding failed');
                }
                $item['image'] = 'data:image/jpeg;base64,' . $encoded;
            } else {
                $item['image'] = '';
            }
            $item['price'] = floatval($item['price']);
        }

        echo json_encode(['success' => true, 'items' => $items]);
    } elseif ($method === 'PATCH') {
        // Update quantity
        $data = json_decode(file_get_contents('php://input'), true);
        $cart_id = $data['cart_id'] ?? '';
        $quantity = $data['quantity'] ?? 1;

        if (empty($cart_id)) {
            throw new Exception('Cart ID required');
        }
        if ($quantity < 1) {
            throw new Exception('Quantity must be at least 1');
        }

        $stmt = $conn->prepare("UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$quantity, $cart_id, $user_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Quantity updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Item not found']);
        }
    } elseif ($method === 'DELETE') {
        // Remove from cart
        $data = json_decode(file_get_contents('php://input'), true);
        $cart_id = $data['cart_id'] ?? '';

        if (empty($cart_id)) {
            throw new Exception('Cart ID required');
        }

        $stmt = $conn->prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?");
        $stmt->execute([$cart_id, $user_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Item not found']);
        }
    }
} catch (PDOException $e) {
    error_log('Database error in cart.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in cart.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>