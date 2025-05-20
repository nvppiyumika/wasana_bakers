<?php
session_start();
require '../db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch cart items for logged-in user
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Please log in to view your cart.']);
        exit;
    }
    $user_id = $_SESSION['user_id'];
    $sql = "SELECT c.id, p.name, p.price, p.image, c.quantity FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $items = [];
    while ($row = $result->fetch_assoc()) {
        // Fallback image if missing
        if (empty($row['image'])) {
            $row['image'] = 'images/placeholder.png';
        }
        $items[] = $row;
    }
    echo json_encode(['success' => true, 'items' => $items]);
    exit;
}


// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please log in to add items to cart.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['product_id']) || !isset($data['quantity'])) {
    echo json_encode(['success' => false, 'message' => 'Missing product or quantity.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$product_id = intval($data['product_id']);
$quantity = intval($data['quantity']);

// Check if product exists and is in stock
$stmt = $conn->prepare('SELECT availability FROM products WHERE id = ?');
$stmt->bind_param('i', $product_id);
$stmt->execute();
$stmt->bind_result($availability);
if (!$stmt->fetch() || $availability !== 'in_stock') {
    echo json_encode(['success' => false, 'message' => 'Product not available.']);
    exit;
}
$stmt->close();

// Insert or update cart item
$sql = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)';
$stmt = $conn->prepare($sql);
$stmt->bind_param('iii', $user_id, $product_id, $quantity);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Added to cart.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}
$stmt->close();
$conn->close();

// Clear cart on logout (optional, for demo)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in.']);
        exit;
    }
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['cart_id'])) {
        $cart_id = intval($data['cart_id']);
        $sql = "DELETE FROM cart_items WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $cart_id, $_SESSION['user_id']);
        $stmt->execute();
        $stmt->close();
        echo json_encode(['success' => true, 'message' => 'Item removed from cart.']);
        exit;
    } else {
        $user_id = $_SESSION['user_id'];
        $conn->query("DELETE FROM cart_items WHERE user_id = $user_id");
        echo json_encode(['success' => true, 'message' => 'Cart cleared.']);
        exit;
    }
}
