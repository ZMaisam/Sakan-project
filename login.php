<?php
session_start();
require "connect.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: login.html");
    exit();
}

$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    die("يرجى تعبئة جميع الحقول.");
}

$stmt = $conn->prepare("SELECT id, password FROM renter WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($id, $hash);
if ($stmt->fetch() && password_verify($password, $hash)) {
    $_SESSION['renter_id'] = $id;
    $stmt->close();
    header("Location: myposts.html");
    exit();
}
$stmt->close();

$stmt = $conn->prepare("SELECT id, password FROM student WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($id, $hash);
if ($stmt->fetch() && password_verify($password, $hash)) {
    $_SESSION['student_id'] = $id;
    $stmt->close();
    header("Location: index.html");
    exit();
}
$stmt->close();

echo "Wrong email or password.";
?>
