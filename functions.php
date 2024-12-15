<?php
include 'db.php';

// Fetch all products
function getProducts() {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM products");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function addProduct($name, $price, $description, $imagePaths) {
    global $conn;

    // Ensure $imagePaths is an array, then implode it into a comma-separated string
    if (is_array($imagePaths)) {
        $imagePaths = implode(',', $imagePaths); 
    }

    // Use a prepared statement to avoid SQL injection
    $stmt = $conn->prepare("INSERT INTO products (name, price, description, images) VALUES (:name, :price, :description, :images)");

    // Bind the parameters to the statement
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':images', $imagePaths);

    // Execute the statement
    $stmt->execute();
}



// Fetch all orders
function getOrders() {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM orders");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Update order status
function updateOrderStatus($id, $status) {
    global $conn;
    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
}
?>
