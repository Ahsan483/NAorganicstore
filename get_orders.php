<?php
// Include the database connection file
include('db.php');

// Set the content type to JSON for the response
header('Content-Type: application/json');

try {
    // SQL query to fetch all orders from the database
    $sql = "SELECT id, first_name, last_name, email, phone, address, created_at, cart FROM orders";
    $stmt = $conn->prepare($sql); // Prepare the SQL query
    $stmt->execute(); // Execute the query

    // Check if any orders are found
    if ($stmt->rowCount() > 0) { // Use rowCount() to check for results
        // Create an array to store the order data
        $orders = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) { // Fetch each order as an associative array
            // Decode the cart JSON stored in the database
            $cart = json_decode($row['cart'], true);

            // Add order details along with cart details to the orders array
            $orders[] = [
                'id' => $row['id'],
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'email' => $row['email'],
                'phone' => $row['phone'],
                'address' => $row['address'],
                'created_at' => $row['created_at'],
                'cart' => $cart // Include the cart details here (decoded from JSON)
            ];
        }

        // Return the orders with cart details as a JSON response
        echo json_encode([
            'success' => true,
            'orders' => $orders
        ]);
    } else {
        // If no orders are found, return an error message
        echo json_encode([
            'success' => false,
            'message' => 'No orders found'
        ]);
    }
} catch (PDOException $e) {
    // Handle database errors
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

// Close the database connection (not required in PDO, but can be added for good practice)
$conn = null;
?>
