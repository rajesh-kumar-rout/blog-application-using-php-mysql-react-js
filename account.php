<?php 

require("include/db.php");

$token = $_GET["token"] ?? "";

$stmt = $db->prepare("
	SELECT
        blogUsers.id,
        blogUsers.name,
        blogUsers.email,
        blogUsers.createdAt,
        blogUsers.updatedAt
    FROM
        blogTokens
    INNER JOIN blogUsers ON blogUsers.id = blogTokens.userId
    WHERE blogTokens.token = :token
    LIMIT 1
");

$stmt->bindParam(":token", $token);

$stmt->execute();

$user = $stmt->fetch();

echo json_encode($user);
