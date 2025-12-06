<?php
session_start();
require "connect.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: signup.html");
    exit();
}

$name     = trim($_POST['name'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$gender   = $_POST['gender'] ?? '';
$type     = $_POST['role'] ?? '';  // 'student' or 'renter'

if (!$name || !$phone || !$email || !$password || !$gender || !$type) {
    die("يرجى تعبئة جميع الحقول.");
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

/* check email in both tables */
$exists = false;

$stmt = $conn->prepare("SELECT id FROM renter WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) $exists = true;
$stmt->close();

if (!$exists) {
    $stmt = $conn->prepare("SELECT id FROM student WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) $exists = true;
    $stmt->close();
}

if ($exists) {
    die("هذا الإيميل مسجل مسبقاً.");
}

/* insert user */
if ($type === 'renter') {
    $stmt = $conn->prepare(
        "INSERT INTO renter (name, phone_num, email, password, gender)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sssss", $name, $phone, $email, $hashed, $gender);
    $stmt->execute();
    $_SESSION['renter_id'] = $stmt->insert_id;
    $stmt->close();
    header("Location: myposts.html");
    exit();
} else {
    $stmt = $conn->prepare(
        "INSERT INTO student (name, phone_num, email, password, gender)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sssss", $name, $phone, $email, $hashed, $gender);
    $stmt->execute();
    $_SESSION['student_id'] = $stmt->insert_id;
    $stmt->close();
    header("Location: index.html");
    exit();
}
?>
