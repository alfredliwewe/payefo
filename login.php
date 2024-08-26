<?php
require 'db.php';

$settings = [];

$read = $db->query("SELECT * FROM config");
while ($row = $read->fetch_assoc()) {
	$settings[$row['name']] = $row['value'];
}

?><!DOCTYPE html>
<html>
<head>
	<title>Login Portal | <?=$settings['name'];?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php require 'links.php';?>
</head>
<body>
	<div id="root"></div>
</div>
</body>

<?php 
$files = [];

$files = [
	'login.jsx',
	//'jsx/Strings.ts'
];

foreach($files as $file){
	echo "<script type='text/babel'>".file_get_contents($file)."</script>";
}
?>
</html>