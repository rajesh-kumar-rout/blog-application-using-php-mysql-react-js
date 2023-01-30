<?php 

require("include/db.php");

$stmt = $db->prepare("
	SELECT
        blogBlogs.id,
        blogBlogs.title,
        SUBSTR(blogBlogs.content, 1, 200) AS content,
        blogBlogs.imageUrl,
        blogBlogs.createdAt,
        blogBlogs.updatedAt,
        blogCategories.name AS category
    FROM
        blogBlogs
    INNER JOIN blogCategories ON blogCategories.id = blogBlogs.categoryId
    ORDER BY blogBlogs.id DESC
");

$stmt->execute();

$blogs = $stmt->fetchAll();

echo json_encode($blogs);
