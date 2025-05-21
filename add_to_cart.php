<?php
require 'db.php';

$user_id = $_POST['user_id'];
$product_id = $_POST['product_id'];
$quantity = $_POST['quantity'];

$sql = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiii", $user_id, $product_id, $quantity, $quantity);

if ($stmt->execute()) {
    echo "added";
} else {
    echo "error";
}
?>
