<?php
require "db_connection.php";

$email = $_POST['email'];
$pass  = $_POST['password'];

$sql = "SELECT * FROM students WHERE email='$email'
        UNION
        SELECT * FROM renters WHERE email='$email'";

$result = $conn->query($sql);

if ($result->num_rows == 1) {
    $user = $result->fetch_assoc();

    if (password_verify($pass, $user['password'])) {
        header("Location: dashboard.html"); 
        exit();
    }
}

echo "Wrong email or password.";
?>