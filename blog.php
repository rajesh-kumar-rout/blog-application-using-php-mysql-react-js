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

echo json_encode($blog);