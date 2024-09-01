<?php
session_start();
require '../../db.php';
require '../../functions.php';
//require '../../imageClass.php';
require '../../includes/String.php';
$time = time();


if (isset($_POST['new_language_name'])) {
	$name = $db->real_escape_string($_POST['new_language_name']);

	$check = $db->query("SELECT * FROM languages WHERE name = '$name' ");
	if ($check->num_rows > 0) {
		echo json_encode(['status' => false, 'message' => "$name is already added"]);
	}
	else{
		$ins = $db->query("INSERT INTO `languages`(`id`, `name`, `status`) VALUES (NULL, '$name', 'active')");
		echo json_encode(['status' => true, 'message' => "Success"]);
	}
}
elseif (isset($_POST['login_email'], $_POST['password'])) {
	$email = $db->real_escape_string($_POST['login_email']);
	$password = md5($_POST['password']);

	$read = $db->query("SELECT * FROM admins WHERE email = '$email' AND password = '$password' ");
	if ($read->num_rows > 0) {
		$data = $read->fetch_assoc();
		$data['status'] = true;

		$_SESSION['user_id'] = $data['id'];
		$_SESSION['data'] = $data;

		echo json_encode($data);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Login failed! Incorrect details"]);
	}
}
elseif (isset($_GET['getEmails'])) {
	$data = [];

	$read = $db->query("SELECT DISTINCT receiver,subject,id FROM emails ORDER BY id DESC ");
	while($row = $read->fetch_assoc()){
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getEmailHeads'])) {
	$email = $db->real_escape_string($_GET['getEmailHeads']);
	$data = [];

	$read = $db->query("SELECT * FROM emails WHERE receiver = '$email' ORDER BY id DESC ");
	while($row = $read->fetch_assoc()){
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getCountries'])) {
	$data = [];

	$read = $db->query("SELECT * FROM countries ");
	while($row = $read->fetch_assoc()){
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getStaff'])) {
	$data = [];

	$read = $db->query("SELECT * FROM staff ");
	while($row = $read->fetch_assoc()){
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getStudents'])) {
	$data = [];

	$read = $db->query("SELECT * FROM students ");
	while($row = $read->fetch_assoc()){
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getSubjects'])) {
	$data = [];

	$read = $db->query("SELECT * FROM subjects ");
	while($row = $read->fetch_assoc()){
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_POST['new_subject'])) {
	db_insert("subjects", [
		'name' => $_POST['new_subject']
	]);

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif(isset($_POST['new_staff_name'], $_POST['email'], $_POST['phone'])){
	//
	db_insert("staff", [
		'name' => $_POST['new_staff_name'],
		'email' => $_POST['email'],
		'password' => md5('1234'),
		'status' => 'active',
		'phone' => $_POST['phone'],
		'picture' => 'avatar.png',
	]);

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif (isset($_GET['getSettings2'])) {
	$data = [];

	$read = $db->query("SELECT * FROM config");
	while ($row = $read->fetch_assoc()) {
		$data[$row['name']] = $row['value'];
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getSettings'])) {
	$data = [];
	$object = [];

	$read = $db->query("SELECT * FROM config ");
	while($row = $read->fetch_assoc()){
		array_push($data, $row);
		$object[$row['name']] = $row['value'];
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(['rows' => $data, 'data' => $object]);
}

elseif (isset($_POST['updateSettings'])) {
	$cols = [];

	foreach ($_POST as $key => $value) {
		if ($key != "updateSettings") {
			$key = $db->real_escape_string($key);
			$value = $db->real_escape_string($value);

			$db->query("UPDATE config SET value = '$value' WHERE name = '$key' ");
		}
	}

	//db_update("config", $cols);

	echo json_encode(['status' => true, 'message' => "Success"]);
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
elseif (isset($_GET['getSubscriptions'])) {
	$users = [];
	$read = $db->query("SELECT * FROM students ");
	while ($row = $read->fetch_assoc()) {
		$users[$row['id']] = $row;
	}

	$packages = [];
	$read = $db->query("SELECT * FROM packages ");
	while ($row = $read->fetch_assoc()) {
		$packages[$row['id']] = $row;
	}

	$data = [];

	$read = $db->query("SELECT * FROM subscriptions ");
	while($row = $read->fetch_assoc()){
		$row['package_data'] = $packages[$row['package']];
		$row['user_data'] = $users[$row['user']];

		$row['start_date'] = date('d-M-Y H:i', $row['start_date']);
		$row['end_date'] = date('d-M-Y H:i', $row['end_date']);
		array_push($data, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif(isset($_POST['new_package'], $_POST['duration'], $_POST['price'], $_POST['description'])){
	$data = getData("packages", ['name' => $_POST['new_package']]);
	if ($data == null) {
		db_insert("packages", [
			'name' => $_POST['new_package'],
			'duration' => $_POST['duration'],
			//'businesses' => $_POST['businesses'],
			'status' => "active",
			'description' => $_POST['description'],
			'amount' => $_POST['price'],
		]);

		echo json_encode(['status' => true, 'message' => "Sucess"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Package is already added"]);
	}
}
elseif (isset($_POST['rejectSubscription'])) {
	db_update("subscriptions", ['status' => 'rejected'], ['id' => (int)$_POST['rejectSubscription']]);
	echo "Rejected";
}
elseif (isset($_POST['confirmSubscription'])) {
	db_update("subscriptions", ['status' => 'active'], ['id' => (int)$_POST['confirmSubscription']]);
	echo "Accepted";
}
elseif (isset($_POST['country_id'], $_POST['edit_country'], $_POST['currency'], $_POST['rating'], $_POST['currency_code'])) {
	db_update("countries", [
		'name' => strtoupper($_POST['edit_country']),
		'printable_name' => ucwords($_POST['edit_country']),
		'currency' => $_POST['currency'],
		'rating' => (double)$_POST['rating'],
		'currency_code' => $_POST['currency_code']
	], [
		'id' => (int)$_POST['country_id']
	]);
	echo json_encode(['status' => true, 'message' => "Updated"]);
}
else{
	echo "no data - ".json_encode($_POST);
}