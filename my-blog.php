<?php 

require("include/authenticate.php");

$blogId = $_GET["blogId"] ?? -1;

$stmt = $db->prepare("
	SELECT
        blogBlogs.id,
        blogBlogs.title,
        blogBlogs.content,
        blogBlogs.categoryId,
        blogBlogs.imageUrl,
        blogBlogs.createdAt,
        blogBlogs.updatedAt
    FROM
        blogBlogs
    WHERE blogBlogs.userId = :currentUserId AND id = :blogId
    LIMIT 1
");

$stmt->bindParam(":currentUserId", $currentUserId);
$stmt->bindParam(":blogId", $blogId);

$stmt->execute();

$blog = $stmt->fetch();

echo json_encode($blog);