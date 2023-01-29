<?php 

require("include/authenticate.php");

$stmt = $db->prepare("
	SELECT
        blogBlogs.id,
        blogBlogs.title,
        blogBlogs.imageUrl,
        blogBlogs.createdAt,
        blogBlogs.updatedAt,
        blogCategories.name AS category
    FROM
        blogBlogs
    INNER JOIN blogCategories ON blogCategories.id = blogBlogs.categoryId
    WHERE blogBlogs.userId = :currentUserId
    ORDER BY blogBlogs.id DESC
");

$stmt->bindParam(":currentUserId", $currentUserId);

$stmt->execute();

$blogs = $stmt->fetchAll();

echo json_encode($blogs);