<?php
header('Content-Type: application/json');
include 'config.php';

try {
    // Verify database connection
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    // Get form data
    $product_id = $_POST['product_id'] ?? '';
    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? '';
    $availability = $_POST['availability'] ?? '';

    // Validate inputs
    if (empty($product_id) || !is_numeric($product_id)) {
        throw new Exception('Invalid product ID');
    }
    if (empty($name) || strlen($name) > 100) {
        throw new Exception('Product name is required and must be less than 100 characters');
    }
    $valid_categories = ['Cake', 'Bread', 'Pastry', 'Dessert', 'Sweets'];
    if (!in_array($category, $valid_categories)) {
        throw new Exception('Invalid category');
    }
    if (!is_numeric($price) || $price <= 0) {
        throw new Exception('Price must be a positive number');
    }
    $valid_availability = ['in_stock', 'out_of_stock'];
    if (!in_array($availability, $valid_availability)) {
        throw new Exception('Invalid availability status');
    }

    // Prepare update query
    $query = "UPDATE products SET name = ?, category = ?, price = ?, availability = ?";
    $params = [$name, $category, floatval($price), $availability];

    // Handle image if provided
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = $_FILES['image'];
        // Validate image
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($image['type'], $allowed_types)) {
            throw new Exception('Invalid image format. Only JPEG, PNG, and GIF are allowed.');
        }
        if ($image['size'] > 64 * 1024 * 1024) {
            throw new Exception('Image size exceeds 64MB.');
        }
        // Read image data
        $image_data = file_get_contents($image['tmp_name']);
        if ($image_data === false) {
            throw new Exception('Failed to read image data');
        }
        // Add image to query
        $query .= ", image = ?";
        $params[] = $image_data;
    }

    // Complete query
    $query .= " WHERE id = ?";
    $params[] = $product_id;

    // Execute update
    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    // Verify update
    if ($stmt->rowCount() === 0) {
        throw new Exception('No product found with the specified ID or no changes made');
    }

    echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
} catch (PDOException $e) {
    error_log('Database error in update-product.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in update-product.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>