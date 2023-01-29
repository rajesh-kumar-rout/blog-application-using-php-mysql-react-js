<?php 

require("include/db.php");

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
        WHERE email = :email
        LIMIT 1
    ");

    $stmt->bindParam(":email" ,$email);

    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if($user != null) 
    {
        $errors["email"] = "Email already taken";
    }
}

if(strlen(trim($password)) == 0)
{
    $errors["password"] = "Password must not contain only empty space";
}
else if (strlen($password) < 6 || strlen($password) > 20) 
{
    $errors["password"] = "Password must be within 6-20 characters";
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

if(count($profileImage) > 0) 
{
    $destination = "uploads/" . bin2hex(random_bytes(12)) . "." . pathinfo($profileImage["name"], PATHINFO_EXTENSION);

    move_uploaded_file($profileImage["tmp_name"], $destination);

    $profileImageUrl = $baseUrl . "/" . $destination;
} 
else 
{
    $profileImageUrl = "";
}

$stmt = $db->prepare('
    INSERT INTO blogUsers 
    (
        name,
        email,
        password,
        profileImageUrl
    )
    VALUES
    (
        :name,
        :email,
        :password,
        :profileImageUrl
    )
');

$password = password_hash($password, PASSWORD_DEFAULT);

$stmt->bindParam(":name", $name);

$stmt->bindParam(":email", $email);

$stmt->bindParam(":password", $password);

$stmt->bindParam(":profileImageUrl", $profileImageUrl);

$stmt->execute();

$userId = $db->lastInsertId();

$stmt = $db->prepare("
	INSERT INTO blogTokens
    (
        token,
        userId
    )
    VALUES
    (
        :token,
        :userId
    )
");

$token = bin2hex(random_bytes(32));

$stmt->bindParam(":token", $token);

$stmt->bindParam(":userId", $userId);

$stmt->execute();

echo json_encode(["token" => $token]);
