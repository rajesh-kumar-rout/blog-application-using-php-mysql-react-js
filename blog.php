<?php 

require("include/db.php");

$blogId = $_GET["blogId"] ?? -1;

$stmt = $db->prepare("
	SELECT
        blogBlogs.id,
        blogBlogs.title,
        blogBlogs.content,
        blogBlogs.categoryId,
        blogBlogs.imageUrl,
        blogBlogs.createdAt,
        blogBlogs.updatedAt,
        blogUsers.name AS authorName,
        blogUsers.profileImageUrl AS authorProfileImageUrl
    FROM
        blogBlogs
    INNER JOIN blogUsers ON blogUsers.id = blogBlogs.userId
    WHERE blogBlogs.id = :blogId
    LIMIT 1
");

$stmt->bindParam(":blogId", $blogId);

$stmt->execute();

$blog = $stmt->fetch();

$stmt = $db->prepare("
	SELECT
        id,
        title,
        imageUrl
    FROM
        blogBlogs
    WHERE categoryId = :categoryId AND id != :blogId
    ORDER BY id DESC
    LIMIT 10
");

$stmt->bindParam(":categoryId", $blog["categoryId"]);

$stmt->bindParam(":blogId", $blogId);

$stmt->execute();

$relatedBlogs = $stmt->fetchAll();

echo json_encode([
    "blog" => $blog,
    "relatedBlogs" => $relatedBlogs
]);