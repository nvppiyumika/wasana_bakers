<?php
require '../db.php';
header('Content-Type: application/json');

$category = isset($_GET['category']) ? $_GET['category'] : 'all';
if ($category === 'all') {
    $sql = "SELECT * FROM products WHERE availability = 'in_stock'";
    $stmt = $conn->prepare($sql);
} else {
    $sql = "SELECT * FROM products WHERE category = ? AND availability = 'in_stock'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $category);
}
$stmt->execute();
$result = $stmt->get_result();
$products = array();
while($row = $result->fetch_assoc()) {
    $products[] = $row;
}
echo json_encode($products);
