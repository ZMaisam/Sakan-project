<?php
session_start();
include "connect.php";

// تأكد أن المستخدم مؤجر
if(!isset($_SESSION['renter_id'])){
    die("You must be logged in as a renter to add a room.");
}

$renter_id = $_SESSION['renter_id'];

// استقبال بيانات الفورم
$city = $_POST['city'];
$street = $_POST['street'];
$price = $_POST['price'];
$image = $_POST['image'];
$desc = $_POST['desc'];
$allowed_gender = $_POST['allowed_gender'];

$serial_id = "RM-" . time() . rand(100,999);

// تسجيل الغرفة في قاعدة البيانات
$sql = "INSERT INTO rooms (serial_id, renter_id, city, street, price, image, description, gender)
        VALUES ('$serial_id', '$renter_id', '$city', '$street', '$price', '$image', '$desc', '$allowed_gender')";

if($conn->query($sql) === TRUE){
    $room_id=$conn->insert_id;
    echo "Room added successfully! RoomID: $room_id";
     header("Location: index.html");
     exit();
} else {
    echo "Error: " . $conn->error;
}
?>