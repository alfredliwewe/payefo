<?php
require '../../db.php';

if (isset($_GET['id'])) {
	$id = (int)$_GET['id'];

	$data = $db->query("SELECT * FROM emails WHERE id = '$id' ")->fetch_assoc();
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
<style type="text/css">
	body{
		font-family: Arial, Helvetica, sans-serif;
	}
</style>
</head>
<body>
<?php

echo $data['content'];
?>
</body>
</html>