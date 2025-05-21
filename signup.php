<?php
require 'db.php';

$first = $_POST['first_name'];
$last = $_POST['last_name'];
$address = $_POST['address'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$pass = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (first_name, last_name, address, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $first, $last, $address, $phone, $email, $pass);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}
