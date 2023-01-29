<?php 

require("include/db.php");

$stmt = $db->prepare("
	SELECT
        id,
        name
    FROM
        blogCategories
");

$stmt->execute();

$categories = $stmt->fetchAll();

echo json_encode($categories);