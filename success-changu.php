<?php
session_start();
require 'db.php';
require 'functions.php';

$time = time();

if (isset($_GET['tx_ref'])) {
	$data = getData("progress", ['type' => 'paychangu', 'ref' => $_GET['tx_ref']]);

	if ($data != null) {
		// great...

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
		$data = getData("progress", ['type' => 'fees', 'ref' => $_GET['tx_ref']]);
		if ($data != null) {
			$student_data = getData("students", ['id'=>$data['student']]);

			//save subscription
			$package_progress = getData("progress", ['student' => $data['student'], 'type' => $_GET['tx_ref']]);

			$package_data = getData("packages", ['id' => $package_progress['ref']]);
			$end_time = $time + (24*3600 * 30 * $package_data['duration']);

			db_insert("subscriptions", [
				'user' => $data['student'],
				'package' => $package_progress['ref'],
				'start_date' => $time,
				'end_date' => $end_time,
				'status' => "active",
				'phone' => $_GET['tx_ref'],
				'trans' => $_GET['tx_ref']
			]);

			$_SESSION['email'] = $student_data['email'];
			$_SESSION['phone'] = $student_data['phone'];
			$_SESSION['name'] = $student_data['name'];
			$_SESSION['student_id'] = $student_data['id'];
			$_SESSION['data'] = $student_data;

			header("location: student/?withHello");
		}
		else{
			$message = "Failed to find transaction reference";
		}
	}
}
else{
	$message = "Blocken link";
}

echo $message;