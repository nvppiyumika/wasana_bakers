<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

// Check if user is logged in as admin
if (!isset($_SESSION['admin_id']) || $_SESSION['type'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Please log in as an admin']);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        exit;
    }

    $name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
    $category = filter_var($_POST['category'] ?? '', FILTER_SANITIZE_STRING);
    $price = filter_var($_POST['price'] ?? 0, FILTER_VALIDATE_FLOAT);
    $availability = filter_var($_POST['availability'] ?? '', FILTER_SANITIZE_STRING);

    if (!$name || !$category || $price <= 0 || !in_array($availability, ['in_stock', 'out_of_stock'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data']);
        exit;
    }

    $image = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $maxSizeMB = 16;
        $maxSizeBytes = $maxSizeMB * 1024 * 1024;
        if ($_FILES['image']['size'] > $maxSizeBytes) {
            echo json_encode(['success' => false, 'message' => 'Image size exceeds 16MB']);
            exit;
        }
        $image = file_get_contents($_FILES['image']['tmp_name']);
        if ($image === false) {
            echo json_encode(['success' => false, 'message' => 'Failed to read image']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Image is required']);
        exit;
    }

    // Direct INSERT query
    $sql = "INSERT INTO products (name, category, price, image, availability) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(1, $name, PDO::PARAM_STR);
    $stmt->bindParam(2, $category, PDO::PARAM_STR);
    $stmt->bindParam(3, $price, PDO::PARAM_STR); // Use PARAM_STR for DECIMAL compatibility
    $stmt->bindParam(4, $image, PDO::PARAM_LOB);
    $stmt->bindParam(5, $availability, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Product added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add product']);
    }
} catch (Exception $e) {
    error_log('Add-products.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>