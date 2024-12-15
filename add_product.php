<?php
include 'functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $price = $_POST['price'];
    $description = $_POST['description'];

    // Handle multiple image uploads
    $targetDir = "uploads/";
    $imagePaths = []; // Initialize an array to store uploaded file paths

    // Loop through all uploaded files
    foreach ($_FILES['images']['name'] as $key => $imageName) {
        $targetFile = $targetDir . basename($imageName);

        // Handle possible upload errors
        if ($_FILES['images']['error'][$key] !== UPLOAD_ERR_OK) {
            echo json_encode(['success' => false, 'message' => 'Error uploading file: ' . $_FILES['images']['name'][$key]]);
            exit;
        }

        // Move the uploaded file to the target directory
        if (move_uploaded_file($_FILES['images']['tmp_name'][$key], $targetFile)) {
            $imagePaths[] = $targetFile; // Store the file path
        } else {
            echo json_encode(['success' => false, 'message' => 'Error moving uploaded file']);
            exit;
        }
    }

    // Convert $imagePaths array to a comma-separated string
    $imagePathsStr = implode(',', $imagePaths);

    if (!empty($imagePathsStr)) {
        // Call the addProduct function
        addProduct($name, $price, $description, $imagePathsStr); // Pass the string of image paths
        echo json_encode(['success' => true, 'message' => 'Product added successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No images were uploaded.']);
    }
}
?>
