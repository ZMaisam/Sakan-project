<?php
require "connect.php";

header('Content-Type: application/json; charset=utf-8');

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing id']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM poster_room WHERE room_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

$images = [];
if (!empty($row['image'])) {
    $images = array_map('trim', explode(',', $row['image']));
}
$row['images'] = $images;

echo json_encode($row);
