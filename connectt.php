<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sakan";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set UTF-8 charset
$conn->set_charset("utf8");

echo "Connected successfully";

?>