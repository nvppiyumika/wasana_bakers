<?php
header('Content-Type: application/json');
include 'config.php';

session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['type'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$name = $_POST['name'] ?? '';
$category = $_POST['category'] ?? '';
$price = $_POST['price'] ?? '';
$availability = $_POST['availability'] ?? 'in_stock';

if (empty($name) || empty($category) || empty($price) || !isset($_FILES['image'])) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

try {
    // Handle image upload
    $image = $_FILES['image'];
    if ($image['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'Image upload failed']);
        exit;
    }

    // Read image file as binary data
    $image_data = file_get_contents($image['tmp_name']);
    if ($image_data === false) {
        echo json_encode(['success' => false, 'message' => 'Failed to read image data']);
        exit;
    }

    // Insert product with image as BLOB
    $stmt = $conn->prepare("INSERT INTO products (name, category, price, image, availability, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$name, $category, $price, $image_data, $availability]);

    echo json_encode(['success' => true, 'message' => 'Product added successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>