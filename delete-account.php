<?php 

require("include/authenticate.php");

$stmt = $db->prepare("
	DELETE FROM blogUsers
    WHERE id = :currentUserId
");

$stmt->bindParam(":currentUserId", $currentUserId);

$stmt->execute();

