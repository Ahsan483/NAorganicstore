<?php
include 'db.php';

header('Content-Type: application/json');

// Log the raw POST data
$rawData = file_get_contents('php://input');
error_log("Raw POST data: " . $rawData); // Log raw data for debugging

// Decode incoming JSON data
$data = json_decode($rawData, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'success' => false,
        'message' => 'JSON decoding error: ' . json_last_error_msg()
    ]);
    exit;
}

// Check if data was properly parsed
if (!is_array($data)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit;
}

// Extract and sanitize customer details
$firstName = isset($data['first_name']) ? trim($data['first_name']) : null;
$lastName = isset($data['last_name']) ? trim($data['last_name']) : null;
$email = isset($data['email']) ? trim($data['email']) : null;
$phone = isset($data['phone']) ? trim($data['phone']) : null;
$address = isset($data['address']) ? trim($data['address']) : null;

// Extract cart details
$cart = isset($data['cart']) && is_array($data['cart']) ? $data['cart'] : [];

// Validate required fields
if (!$firstName || !$lastName || !$email || !$phone || !$address) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Validate phone (allow only digits)
if (!preg_match('/^[0-9]{10,20}$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number']);
    exit;
}

// Convert cart to JSON
$cartJson = json_encode($cart);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Cart encoding error: ' . json_last_error_msg()]);
    exit;
}

try {
    // Insert order details into the orders table
    $stmt = $conn->prepare("
        INSERT INTO orders (first_name, last_name, email, phone, address, cart) 
        VALUES (:first_name, :last_name, :email, :phone, :address, :cart)
    ");
    $stmt->bindParam(':first_name', $firstName);
    $stmt->bindParam(':last_name', $lastName);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':cart', $cartJson);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Order saved successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
