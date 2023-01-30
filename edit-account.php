<?php 

require("include/authenticate.php");
$name = trim($_POST["name"] ?? "");

$email = trim($_POST["email"] ?? "");

$password = $_POST["password"] ?? "";

$profileImage = $_FILES["profileImage"] ?? [];

$errors = [];

if(strlen($name) == 0 || strlen($name) > 30)
{
    $errors["name"] = "Name name must be within 1-30 characters";
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL))
{
    $errors["email"] = "Invalid email";
}
else if (strlen($email) > 30) 
{
    $errors["email"] = "Email must be within 30 characters";
}
else 
{
    $stmt = $db->prepare("
        SELECT 1
        FROM blogUsers
        WHERE email = :email AND id != :currentUserId
        LIMIT 1
    ");

    $stmt->bindParam(":email" ,$email);

    $stmt->bindParam(":currentUserId" ,$currentUserId);

    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if($user != null) 
    {
        $errors["email"] = "Email already taken";
    }
}

if (count($profileImage) > 0) 
{
    if(!in_array($profileImage["type"], ["image/jpeg", "image/png", "image/jpg"]))
    {
        $errors["profileImage"] = "Profile image must be of type jpeg, jpg and png";
    }
    else if($profileImage["size"] > 2097152)
    {
        $errors["profileImage"] = "Profile image must be within 2 MB";
    }
}

if(count($errors) > 0)
{
    http_response_code(422);

    echo json_encode($errors);

    die;
}

$stmt = $db->prepare("
	SELECT
        profileImageUrl
    FROM
        blogUsers
    WHERE id = :currentUserId
    LIMIT 1
");

$stmt->bindParam(":currentUserId", $currentUserId);

$stmt->execute();

$user = $stmt->fetch();

if(count($profileImage) > 0) 
{
    $destination = "uploads/" . bin2hex(random_bytes(12)) . "." . pathinfo($profileImage["name"], PATHINFO_EXTENSION);

    move_uploaded_file($profileImage["tmp_name"], $destination);

    if($user["profileImageUrl"])
    {
        $previousProfileImage = str_replace($baseUrl . "/", "", $user["profileImageUrl"]);

        unlink($previousProfileImage);
    }

    $user["profileImageUrl"] = $baseUrl . "/" . $destination;
} 

$stmt = $db->prepare("
    UPDATE blogUsers
    SET
        name = :name,
        email = :email,
        profileImageUrl = :profileImageUrl
    WHERE id = :currentUserId
");

$stmt->bindParam(":name", $name);

$stmt->bindParam(":email", $email);

$stmt->bindParam(":profileImageUrl", $user["profileImageUrl"]);

$stmt->bindParam(":currentUserId", $currentUserId);

$stmt->execute();