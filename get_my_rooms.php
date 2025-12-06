<?php
session_start();
require "connect.php";

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['renter_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$renter_id = $_SESSION['renter_id'];

$stmt = $conn->prepare("SELECT * FROM poster_room WHERE renter_id = ? ORDER BY room_id DESC");
$stmt->bind_param("i", $renter_id);
$stmt->execute();
$res = $stmt->get_result();

$rooms = [];

while ($row = $res->fetch_assoc()) {
    $images = [];
    if (!empty($row['image'])) {
        $images = array_map('trim', explode(',', $row['image']));
    }
    $row['images'] = $images;
    $rooms[] = $row;
}

echo json_encode($rooms);
