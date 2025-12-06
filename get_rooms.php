<?php
require "connect.php";

header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT * FROM poster_room ORDER BY room_id DESC";
$res = $conn->query($sql);

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
