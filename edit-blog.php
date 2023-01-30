<?php 

require("include/authenticate.php");

$image = $_FILES["image"] ?? [];

$title = trim($_POST["title"] ?? "");

$content = trim($_POST["content"] ?? "");

$categoryId = $_POST["categoryId"] ?? -1;

$blogId = $_GET["blogId"] ?? -1;

$errors = [];

if(strlen($title) == 0 || strlen($title) > 255) 
{
    $errors["title"] = "Title must be within 1-255 characters";
}

if(strlen($content) == 0 || strlen($content) > 5000) 
{
    $errors["content"] = "Content must be within 5000 characters";
}

$stmt = $db->prepare("
    SELECT 1
    FROM blogCategories
    WHERE id = :categoryId
    LIMIT 1
");

$stmt->bindParam(":categoryId" ,$categoryId);

$stmt->execute();

$category = $stmt->fetch();

if($category == null) 
{
    $errors["CategoryId"] = "Category not found";
}

if (count($image) > 0) 
{
    if(!in_array($image["type"], ["image/jpeg", "image/png", "image/jpg"]))
    {
        $errors["image"] = "Image must be of type jpeg, jpg and png";
    }
    else if($image["size"] > 2097152)
    {
        $errors["image"] = "Image must be within 2 MB";
    }
}

$stmt = $db->prepare("
	SELECT *
    FROM blogBlogs
    WHERE id = :blogId AND userId = :currentUserId
    LIMIT 1
");

$stmt->bindParam(":blogId", $blogId);

$stmt->bindParam(":currentUserId", $currentUserId);

$stmt->execute();

$blog = $stmt->fetch();

if($blog == null)
{
    $errors["blogId"] = "Blog not found";
}

if(count($errors) > 0)
{
    http_response_code(422);

    echo json_encode($errors);

    die;
}

if(count($image) > 0) 
{
    $destination = "uploads/" . bin2hex(random_bytes(12)) . "." . pathinfo($image["name"], PATHINFO_EXTENSION);

    move_uploaded_file($image["tmp_name"], $destination);

    $previousImage = str_replace($baseUrl . "/", "", $blog["imageUrl"]);

    unlink($previousImage);

    $blog["imageUrl"] = $baseUrl . "/" . $destination;
}

$stmt = $db->prepare("
	UPDATE blogBlogs
    SET
        title = :title,
        content = :content,
        imageUrl = :imageUrl,
        categoryId = :categoryId
    WHERE id = :blogId
");

$stmt->bindParam(":title", $title);

$stmt->bindParam(":content", $content);

$stmt->bindParam(":imageUrl", $blog["imageUrl"]);

$stmt->bindParam(":categoryId", $categoryId);

$stmt->bindParam(":blogId", $blogId);

$stmt->execute();
