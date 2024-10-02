<?php
session_start();
require 'db.php';
require 'functions.php';

$time = time();

if (isset($_GET['tx_ref'])) {
	$data = getData("progress", ['type' => 'paychangu', 'ref' => $_GET['tx_ref']]);

	
	db_update("students", ['status' => 'verified'], ['id'=>$data['student']]);

	$student_data = getData("students", ['id'=>$data['student']]);

	$_SESSION['email'] = $student_data['email'];
	$_SESSION['phone'] = $student_data['phone'];
	$_SESSION['name'] = $student_data['name'];
	$_SESSION['student_id'] = $student_data['id'];
	$_SESSION['data'] = $student_data;

	header("location: student/?without");
}
else{
	$message = "Blocken link";
}

echo $message;