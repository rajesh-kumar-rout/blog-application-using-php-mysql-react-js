<?php 

require("include/authenticate.php");

$categoryId = $_GET["categoryId"] ?? -1;

$stmt = $db->prepare("
	SELECT
        id,
        title,
        imageUrl
    FROM
        blogBlogs
    WHERE categoryId = :categoryId
    ORDER BY id DESC
    LIMIT 10
");

$stmt->bindParam(":categoryId", $categoryId);

$stmt->execute();

$relatedBlogs = $stmt->fetchAll();

echo json_encode($relatedBlogs);