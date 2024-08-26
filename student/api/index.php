<?php
session_start();
require '../../db.php';
require '../../functions.php';
//require '../../imageClass.php';
require '../../includes/String.php';
$time = time();

$student_id = $_SESSION['student_id'];

if (isset($_GET['getSettings2'])) {
	$data = [];

	$read = $db->query("SELECT * FROM config");
	while ($row = $read->fetch_assoc()) {
		$data[$row['name']] = $row['value'];
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}

elseif (isset($_GET['getSubscriptions'])) {
	$rows = [];

	$read = $db->query("SELECT * FROM subscriptions WHERE user = '$student_id' AND end_date > '$time' AND status = 'active' ");
	while ($row = $read->fetch_assoc()) {
		$row['package_data'] = getData("packages", ['id' => $row['package']]);
		$row['expires'] = date('d M Y', $row['end_date']);
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_POST['addSubscription'], $_POST['id'])) {
	$user_id = $_SESSION['student_id'];
	$package_data = getData("packages", ['id' => $_POST['id']]);

	$end_time = $time + (24*3600 * 30 * $package_data['duration']);

	db_insert("subscriptions", [
		'user' => $user_id,
		'package' => $_POST['id'],
		'start_date' => $time,
		'end_date' => $end_time,
		'status' => "pending",
		'phone' => $_POST['phone_number'],
		'trans' => $_POST['transId']
	]);

	echo json_encode(['status' => true, 'message' => "Added"]);
}
elseif (isset($_GET['getPackages'])) {
	$data = [];

	$read = $db->query("SELECT * FROM packages ");
	while($row = $read->fetch_assoc()){
		$row['subscriptions'] = $db->query("SELECT COUNT(id) AS count_all FROM subscriptions WHERE package = '{$row['id']}' ")->fetch_assoc()['count_all'];
		$row['price'] = $row['amount'];
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getSubjects'])) {
	$rows = [
		['id'=>0,'name'=> 'All']
	];
	$read = $db->query("SELECT * FROM subjects");
	while ($row = $read->fetch_assoc()) {
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_GET['getUser'])) {

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($_SESSION['data']);
}
elseif (isset($_GET['getBooks'])) {
	$subjects = [];
	$read = $db->query("SELECT * FROM subjects");
	while ($row = $read->fetch_assoc()) {
		$subjects[$row['id']] = $row;
	}

	$admins = [];
	$read = $db->query("SELECT * FROM admins");
	while ($row = $read->fetch_assoc()) {
		$admins[$row['id']] = $row;
	}

	$rows = [];

	$read = $db->query("SELECT * FROM books");
	while ($row = $read->fetch_assoc()) {
		$row['admin_data'] = $admins[$row['admin']];
		$row['subject_data'] = $subjects[$row['subject']];
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}