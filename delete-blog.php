<?php 

require("include/authenticate.php");

$blogId = $_GET["blogId"] ?? -1;

$stmt = $db->prepare("
	SELECT imageUrl
    FROM blogBlogs
    WHERE id = :blogId AND userId = :currentUserId
");

$stmt->bindParam(":currentUserId", $currentUserId);

$stmt->bindParam(":blogId", $blogId);

$stmt->execute();

$blog = $stmt->fetch();

if(!$blog)
{
    http_response_code(404);

    echo json_encode(["error" => "Blog not found"]);

    die;
}

$previousImage = str_replace($baseUrl . "/", "", $blog["imageUrl"]);

unlink($previousImage);

$stmt = $db->prepare("
	DELETE FROM blogBlogs
    WHERE id = :blogId AND userId = :currentUserId
");

$stmt->bindParam(":currentUserId", $currentUserId);

$stmt->bindParam(":blogId", $blogId);

$stmt->execute();

