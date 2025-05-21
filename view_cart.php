<?php
require 'db.php';

$user_id = $_GET['user_id'];

$sql = "SELECT p.name, p.price, c.quantity, (p.price * c.quantity) AS total 
        FROM cart_items c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$cart = array();
while($row = $result->fetch_assoc()) {
    $cart[] = $row;
}

header('Content-Type: application/json');
echo json_encode($cart);
?>
