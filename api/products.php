<?php
header('Content-Type: application/json');
include 'config.php';

$category = $_GET['category'] ?? 'all';
$product_id = $_GET['id'] ?? null;

try {
    // Verify database connection
    if (!$conn) {
        throw new Exception('Database connection failed');
    }

    if ($product_id !== null) {
        // Fetch single product by ID
        $query = "SELECT id, name, category, price, image, availability FROM products WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$product_id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            exit;
        }

        // Process single product
        $product['price'] = floatval($product['price']);
        if ($product['image'] && is_string($product['image']) && strlen($product['image']) > 0) {
            $encoded = base64_encode($product['image']);
            if ($encoded === false) {
                throw new Exception('Base64 encoding failed');
            }
            $product['image'] = 'data:image/jpeg;base64,' . $encoded;
        } else {
            $product['image'] = '';
        }
        echo json_encode($product);
    } else {
        // Fetch all products (existing logic)
        $query = "SELECT id, name, category, price, image, availability FROM products";
        if ($category !== 'all') {
            $query .= " WHERE category = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$category]);
        } else {
            $stmt = $conn->prepare($query);
            $stmt->execute();
        }

        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as &$product) {
            try {
                $product['price'] = floatval($product['price']);
                if ($product['image'] && is_string($product['image']) && strlen($product['image']) > 0) {
                    $encoded = base64_encode($product['image']);
                    if ($encoded === false) {
                        throw new Exception('Base64 encoding failed');
                    }
                    $product['image'] = 'data:image/jpeg;base64,' . $encoded;
                } else {
                    $product['image'] = '';
                }
            } catch (Exception $e) {
                error_log('Error processing product ID ' . $product['id'] . ': ' . $e->getMessage());
                $product['image'] = '';
            }
        }
        echo json_encode($products);
    }
} catch (PDOException $e) {
    error_log('Database error in products.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log('General error in products.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>