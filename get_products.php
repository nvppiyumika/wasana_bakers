<?php
require 'db.php';

$sql = "SELECT * FROM products WHERE availability = 'in_stock'";
$result = $conn->query($sql);

$products = array();
while($row = $result->fetch_assoc()) {
    $products[] = $row;
}

header('Content-Type: application/json');
echo json_encode($products);
?>
