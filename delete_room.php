<?php
session_start();
require "connect.php";

if (!isset($_SESSION['renter_id'])) {
    http_response_code(401);
    echo "You must be logged in as a renter.";
    exit;
}

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo "Missing room id.";
    exit;
}

$renter_id = $_SESSION['renter_id'];
$room_id   = intval($_GET['id']);

$stmt = $conn->prepare("DELETE FROM poster_room WHERE room_id = ? AND renter_id = ?");
$stmt->bind_param("ii", $room_id, $renter_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "تم حذف الغرفة بنجاح.";
} else {
    echo "فشل حذف الغرفة (قد لا تكون هذه الغرفة الخاصة بك).";
}

$stmt->close();
$conn->close();
