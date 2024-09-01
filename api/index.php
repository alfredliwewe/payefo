<?php
session_start();
require '../db.php';
require '../functions.php';

if (isset($_POST['email_login'], $_POST['password'])) {
	$phone = $db->real_escape_string($_POST['email_login']);
	$password = $db->real_escape_string(md5($_POST['password']));

	$sql = $db->query("SELECT * FROM students WHERE phone = '$phone' OR email = '$phone' ");
	if ($sql->num_rows > 0) {
		$data = $sql->fetch_assoc();
		if ($data['password'] == $password) {
			if ($data['status'] == "deactivated") {
				echo json_encode(['status' => false, 'message' => 'You can\'t login! Inactive. Contact administrator']);
			}
			else{
				$_SESSION['email'] = $data['email'];
				$_SESSION['phone'] = $data['phone'];
				$_SESSION['name'] = $data['name'];
				$_SESSION['student_id'] = $data['id'];

				echo json_encode(['status' => true, 'link' => 'student/']);
			}
		}
		else{
			echo json_encode(['status' => false, 'message' => "Password is incorrect", 'type' => 'password']);
		}
	}
	else{
		$sqll = $db->query("SELECT * FROM staff WHERE phone = '$phone' OR email = '$phone' ");
		
		if ($sqll->num_rows > 0) {
			$data = $sqll->fetch_assoc();

			if ($data['password'] == $password) {
				# success...
				$_SESSION['user_id'] = $data['id'];
				$_SESSION['phone'] = $data['phone'];
				$_SESSION['name'] = $data['name'];
				//$_SESSION['role'] = $data['role'];

				$data['status'] = true;
				$data['link'] = 'teacher/';

				//echo json_encode(['status' => true, 'link' => $data['role'].'/']);
				echo json_encode($data);
			}
			else{
				//
				echo json_encode(['status' => false, 'message' => "Password is incorrect", 'type' => 'password']);
			}
		}
		else{
			echo json_encode(['status' => false, 'message' => 'Wrong details entered', 'type' => 'email']);
		}
	}
}
elseif(isset($_POST['fullname'], $_POST['phone'], $_POST['email_register'], $_POST['password'])){
	$insert_id = db_insert("students", [
		'name' => $_POST['fullname'],
		'phone' => $_POST['phone'],
		'email' => $_POST['email_register'],
		'password' => md5($_POST['password']),
		'status' => "active",
		'photo' => 'default_avatar.png',
	]);

	$data = getData("students", ['id' => $insert_id]);

	$_SESSION['email'] = $data['email'];
	$_SESSION['phone'] = $data['phone'];
	$_SESSION['name'] = $data['name'];
	$_SESSION['student_id'] = $data['id'];

	echo json_encode(['status' => true, 'link' => 'student/']);
}
elseif (isset($_GET['getSettings'])) {
	$data = [];

	$read = $db->query("SELECT * FROM config");
	while ($row = $read->fetch_assoc()) {
		$data[$row['name']] = $row['value'];
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
else{
	echo "no data - ".json_encode($_POST);
}