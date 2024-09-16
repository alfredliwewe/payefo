<?php 
session_start();
require '../db.php';
require '../functions.php';

if (isset($_SESSION['student_id'])) {
	$name = $_SESSION['name'];
}
else{
	header("location: ../");
}
?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Student Page | <?=$name;?></title>
	<?php require '../admin/links.php';?>
	<style type="text/css">
		.menu-button.active{
			position: relative;
		}
		.menu-button.active::after{
			content: '';
			height: 100%;
			width: 3px;
			border-top-left-radius: 6px;
			border-bottom-left-radius: 6px;
			background-color: var(--dark);
			position: absolute;
			top: 0;
			right: 0;
		}
	
		.menu-button.active{
			position: relative;
		}
		.menu-button.active::after{
			content: '';
			height: 100%;
			width: 3px;
			border-top-left-radius: 6px;
			border-bottom-left-radius: 6px;
			background-color: var(--dark);
			position: absolute;
			top: 0;
			right: 0;
		}
		.w3-table td, .w3-table th{
            font-family: "Roboto","Helvetica","Arial",sans-serif;
            font-weight: 400;
            font-size: 0.875rem;
            line-height: 1.43;
            letter-spacing: 0.01071em;
            display: table-cell;
            vertical-align: inherit;
            border-bottom: 1px solid rgba(224, 224, 224, 1);
            text-align: left;
            color: rgba(0, 0, 0, 0.87);
        }
        .w3-table th{
        	font-weight: 600;
        	color: #235a81;
        }
        .link-color{
        	color: #235a81;
        }
	</style>
</head>
<body>
<div id="root"></div>
</body>
<?php 
if (isset($_SESSION['student_id'])) {
	?>
	<!--<script src="https://in.paychangu.com/js/popup.js" type="text/javascript"></script>-->
	<?php
	echo "<script>".file_get_contents("../changu.js")."</script>";
	?>
	<script type="text/javascript">
	</script>
	<div id="wrapper"></div>
	<?php

	
	$data = getData("students", ['id' => $_SESSION['student_id']]);
	if ($data['status'] == "verified") {
		if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "android") OR strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "iphone")) {
			$files = [
				'jsx/mobile.jsx',
				'jsx/Strings.ts'
			];
		}
		else{
			$files = [
				'jsx/student.jsx',
				'jsx/Strings.ts'
			];
		}
	}
	else{
		$files = [
			'jsx/complete.jsx'
		];
	}
}
else{
	$files = [
		'jsx/login.jsx'
	];
}

foreach($files as $file){
	echo "<script type='text/babel'>".file_get_contents($file)."</script>";
}
?>
</html>