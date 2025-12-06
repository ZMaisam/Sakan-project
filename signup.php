<?php
session_start();
include "connectt.php"; // ملف الاتصال بقاعدة البيانات

$name     = $_POST['name'];
$phone    = $_POST['phone'];
$email    = $_POST['email'];
$password = $_POST['password'];
$genger     = $_POST['gender'];
$role     =$_POST['role']; // "student" أو "renter"

$hashed = password_hash($password, PASSWORD_DEFAULT);

// Check if email exists in renter table
$sql_check_renter = "SELECT * FROM renter WHERE email='$email'";
$result_renter = $conn->query($sql_check_renter);

// Check if email exists in student table
$sql_check_student = "SELECT * FROM student WHERE email='$email'";
$result_student = $conn->query($sql_check_student);

// إذا الحساب موجود في أي جدول
if($result_renter->num_rows > 0 || $result_student->num_rows > 0){
    echo "Account already exists with this email.";
    exit();
}

// تسجيل البيانات حسب النوع
if($role == "renter"){
    $sql = "INSERT INTO renter (name, phone, email, password,gender) VALUES ('$name','$phone','$email','$hashed','$gender')";
    if($conn->query($sql) === TRUE){
        $_SESSION['renter_id'] = $conn->insert_id;
        header("Location: myposts.html"); // ضع هنا صفحة لوحة المؤجر
        exit();
    }
}else{
    $sql = "INSERT INTO student (name, phone, email, password,gender) VALUES ('$name','$phone','$email','$hashed','$gender')";
    if($conn->query($sql) === TRUE){
        $_SESSION['student_id'] = $conn->insert_id;
        header("Location: index.html"); // ضع هنا الصفحة الرئيسية للطالب
        exit();
    }
}

echo "Error: " . $conn->error;
?>