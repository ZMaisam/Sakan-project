<?php

require "db_connection.php";

$name     = $_POST['name'];
$phone    = $_POST['phone'];
$email    = $_POST['email'];
$password = $_POST['password'];
$gender   = $_POST['gender'];
$type     = $_POST['type']; 


$hashed = password_hash($password, PASSWORD_DEFAULT);

if ($type === "student") {
    $table = "students";
} else {
    $table = "renters";
}


$sql = "INSERT INTO $table (name, phone, email, gender, password)
        VALUES ('$name', '$phone', '$email', '$gender', '$hashed')";

if ($conn->query($sql)) {
    echo "Account created successfully!";
} else {
    echo "Error: " . $conn->error;
}

?>
