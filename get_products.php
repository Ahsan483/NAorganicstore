<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    // Fetch products from the database
    $stmt = $conn->prepare("SELECT id, name, price, description, images FROM products");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($products) {
        // Process and format the images field for the frontend
        foreach ($products as &$product) {
            // Convert image paths from a comma-separated string to an array
            $product['images'] = explode(',', $product['images']);
        }

        // Return success response with products
        echo json_encode([
            'success' => true,
            'products' => $products
        ]);
    } else {
        // No products found
        echo json_encode([
            'success' => false,
            'message' => 'No products found.'
        ]);
    }
} catch (PDOException $e) {
    // Handle database query error
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching products: ' . $e->getMessage()
    ]);
}
?>
