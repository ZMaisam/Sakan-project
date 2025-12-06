<?php
session_start();
require "connect.php";

if (!isset($_SESSION['renter_id'])) {
    die("You must be logged in as a renter.");
}

$renter_id = $_SESSION['renter_id'];

$title  = trim($_POST['title']  ?? '');
$city   = trim($_POST['city']   ?? '');
$street = trim($_POST['street'] ?? '');
$price  = trim($_POST['price']  ?? '');
$image  = trim($_POST['image']  ?? '');
$desc   = trim($_POST['desc']   ?? '');
$gender = $_POST['gender'] ?? 'any';

if ($title === '' || $city === '' || $street === '' || $price === '' || $image === '' || $desc === '') {
    die("Missing required fields.");
}

$serial_id = "RM-" . time() . rand(100, 999);

$sql = "INSERT INTO poster_room
        (renter_id, title, city, street, price, description, availability, return_phone, image, gender, serial_id)
        VALUES (?, ?, ?, ?, ?, ?, 'available', '', ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("SQL error: " . $conn->error);
}

$stmt->bind_param(
    "issssssss",
    $renter_id,
    $title,
    $city,
    $street,
    $price,
    $desc,
    $image,
    $gender,
    $serial_id
);

if (!$stmt->execute()) {
    die("Insert failed: " . $stmt->error);
}

$stmt->close();

header("Location: myposts.html");
exit;
