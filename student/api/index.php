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

elseif (isset($_GET['getAttachments'])) {
	$id = (int)$_GET['getAttachments'];
	$type = $db->real_escape_string($_GET['type']);

	$rows = [];

	$read = $db->query("SELECT * FROM attachments WHERE ref = '$id' AND type = '$type' ");
	while ($row = $read->fetch_assoc()) {
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
	echo json_encode(getData("students", [
		'id' => $_SESSION['data']['id']
	]));
}
elseif(isset($_POST['subject_lessons'], $_POST['form'])){
	$subject = (int)$_POST['subject_lessons'];
	$form = (int)$_POST['form'];

	$subjects = [];
	$read = $db->query("SELECT * FROM subjects");
	while ($row = $read->fetch_assoc()) {
		$subjects[$row['id']] = $row;
	}

	$admins = [];
	$read = $db->query("SELECT * FROM staff");
	while ($row = $read->fetch_assoc()) {
		$admins[$row['id']] = $row;
	}

	$rows = [];

	$read = $db->query("SELECT * FROM lessons WHERE form = '$form' AND subject = '$subject' ORDER BY id DESC");
	while ($row = $read->fetch_assoc()) {
		$row['admin_data'] = $admins[$row['teacher']];
		$row['subject_data'] = $subjects[$row['subject']];
		$row['date'] = date('d-M-Y', $row['date_added']);
		$row['ago'] = time_ago($row['date_added']);
		$row['comments'] = (int)$db->query("SELECT COUNT(id) FROM comments WHERE ref = '{$row['id']}' ")->fetch_array()[0];
		$row['opened'] = (int)$db->query("SELECT COUNT(id) FROM progress WHERE ref = '{$row['id']}' AND type = 'lesson' ")->fetch_array()[0];
		$row['attended'] = $db->query("SELECT DISTINCT student FROM progress WHERE ref = '{$row['id']}' AND type = 'lesson' ")->num_rows;
		$row['attachments'] = getAll("attachments", ['ref' => $row['id'], 'type' => 'lesson']);
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_POST['saveOpened'])) {
	db_insert("progress", [
		'student' => $_SESSION['student_id'],
		'ref' => $_POST['saveOpened'],
		'type' => 'lesson',
		'date_added' => $time,
	]);

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif (isset($_FILES['change_picture'])) {
	$filename = $_FILES['change_picture']['name'];

	if (move_uploaded_file($_FILES['change_picture']['tmp_name'], "../../uploads/$filename")) {
		db_update("students", [
			'photo' => $filename
		], ['id' => $_SESSION['student_id']]);

		echo json_encode([
			'status' => true,
			'message' => "Success",
			'filename' => $filename
		]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Failed to upload"]);
	}
}
elseif(isset($_POST['toggleLike'])){
	$check = getData("likes", ['user' => $_SESSION['student_id'], 'post' => $_POST['toggleLike']]);
	//header('Content-Type: application/json; charset=utf-8');
	if ($check == null) {
		db_insert("likes", [
			'user' => $_SESSION['student_id'],
			'post' => $_POST['toggleLike'],
			'type' => 'comment',
			'date_added' => $time,
		]);

		echo json_encode([
			'status' => true,
			'message' => "Liked",
			'hasLiked' => true
		]);
	}
	else{
		db_delete("likes", ['id' => $check['id']]);

		echo json_encode([
			'status' => true,
			'message' => "Hated it",
			'hasLiked' => false
		]);
	}
}
elseif (isset($_GET['getComments'])) {
	$post = (int)$_GET['getComments'];

	$rows = [];

	$students = [];
	$read = $db->query("SELECT * FROM students");
	while ($row = $read->fetch_assoc()) {
		$students[$row['id']] = $row;
	}

	$teachers = [];
	$read = $db->query("SELECT * FROM staff");
	while ($row = $read->fetch_assoc()) {
		$teachers[$row['id']] = $row;
	}

	$read = $db->query("SELECT * FROM comments WHERE ref = '$post' AND parent = '0' ORDER BY id DESC ");
	while ($row = $read->fetch_assoc()) {
		$row['user_data'] = $row['user_type'] == 'student' ? $students[$row['user']] : $teachers[$row['user']];
		$row['user_data']['photo'] = isset($row['user_data']['photo']) ? $row['user_data']['photo'] : $row['user_data']['picture'];

		$row['ago'] = time_ago($row['date_added']);
		$row['likes'] = count(getAll("likes", ['post' => $row['id']]));
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_GET['getReplies'])) {
	$post = (int)$_GET['getReplies'];

	$rows = [];

	$students = [];
	$read = $db->query("SELECT * FROM students");
	while ($row = $read->fetch_assoc()) {
		$students[$row['id']] = $row;
	}

	$teachers = [];
	$read = $db->query("SELECT * FROM staff");
	while ($row = $read->fetch_assoc()) {
		$teachers[$row['id']] = $row;
	}

	$read = $db->query("SELECT * FROM comments WHERE parent = '$post' ORDER BY id DESC ");
	while ($row = $read->fetch_assoc()) {
		$row['user_data'] = $row['user_type'] == 'student' ? $students[$row['user']] : $teachers[$row['user']];
		$row['user_data']['photo'] = isset($row['user_data']['photo']) ? $row['user_data']['photo'] : $row['user_data']['picture'];

		$row['ago'] = time_ago($row['date_added']);
		$row['likes'] = count(getAll("likes", ['post' => $row['id']]));
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif(isset($_POST['lesson_id'], $_POST['new_comment'])){
	db_insert("comments", [
		'user' => $_SESSION['student_id'],
		'user_type' => 'student',
		'comment' => $_POST['new_comment'],
		'date_added' => $time,
		'status' => 'active',
		'ref' => $_POST['lesson_id'],
		'parent' => (int)$_POST['parent']
	]);

	echo json_encode(['status' => true, 'message' => "Success"]);
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