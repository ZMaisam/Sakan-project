<?php
session_start();
include "connectt.php"; 

$email = $_POST['email'];
$password = $_POST['password'];

// Check in renter table first
$sql_renter = "SELECT * FROM renter WHERE email='$email'";
$result_renter = $conn->query($sql_renter);

if ($result_renter->num_rows > 0) {
    $row = $result_renter->fetch_assoc();

    if (password_verify($password, $row['password'])) {
        $_SESSION['renter_id'] = $row['id'];
        header("Location: myposts.html");
        exit();
    }
}

// Check in student table
$sql_student = "SELECT * FROM student WHERE email='$email'";
$result_student = $conn->query($sql_student);

if ($result_student->num_rows > 0) {
    $row = $result_student->fetch_assoc();

    if (password_verify($password, $row['password'])) {
        $_SESSION['student_id'] = $row['id'];
        header("Location: index.html");
        exit();
    }
}

echo "Wrong email or password.";
?>