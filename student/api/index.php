<?php
session_start();
require '../../db.php';
require '../../functions.php';
//require '../../imageClass.php';
require '../../includes/String.php';
$time = time();

//$student_id = $_SESSION['student_id'];
$student_id = 1;

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

elseif (isset($_GET['getExamHistory'])) {
	$rows_all = array_reverse(getAll("response_summary", ['student' => $_SESSION['student_id']]));
	$rows = [];

	foreach ($rows_all as $i => $row) { 
		$row['exam_data'] = getData("exams", ['id' => $row['exam']]);
		$row['course_data'] = getData("subjects", ['id' => $row['exam_data']['subject']]);
		$row['created_at'] = date('d-M-Y H:i A', $row['created_at']);
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_GET['getExamProgress'])) {
	$exam_id = (int)$_GET['getExamProgress'];

	$rows = getAll("response_progress", ['ref' => $exam_id]);

	foreach ($rows as $i => $row) {
		$row['question_data'] = getData("questions", ['id' => $row['question']]);
		$row['options'] = getAll("options", ['question' => $row['question']]);

		$rows[$i] = $row;
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
elseif(isset($_POST['subject_exams'], $_POST['form'])){
	$subject = (int)$_POST['subject_exams'];
	$form = (int)$_POST['form'];
	$term = (int)$_POST['term'];

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

	$read = $db->query("SELECT * FROM exams WHERE form = '$form' AND subject = '$subject' AND term = '$term' ORDER BY id DESC");
	while ($row = $read->fetch_assoc()) {
		$row['admin_data'] = $admins[$row['instructor_id']];
		$row['subject_data'] = $subjects[$row['subject']];
		$row['date'] = date('d-M-Y', $row['created_at']);

		$row['ago'] = time_ago($row['created_at']);
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_POST['exam_id_answers'])) {
	$exam_data = getData("exams", ['id' => $_POST['exam_id_answers']]);

	$rows = getAll("questions", ['exam' => $_POST['exam_id_answers']]);
	$questions = [];

	$wrote = 0;
	$pass = 0;

	$ref = db_insert("response_summary", [
		'exam' => $exam_data['id'],
		'student' => $_SESSION['student_id'],
		'all_questions' => count($rows),
		'wrote' => $wrote,
		'pass' => 0,
		'fail' => 0,
		'score' => 0,
		'created_at' => $time,
	]);

	for ($i=0; $i < count($rows); $i++) { 
		$rows[$i]['options'] = getAll("options", ['question' => $rows[$i]['id']]);
		$correct = 0;
		foreach ($rows[$i]['options'] as $option) {
			if ($option['type'] == "correct") {
				$correct = $option['id'];
			}
		}
		$rows[$i]['correct'] = $correct;
		$questions[$rows[$i]['id']] = $rows[$i];

		if (isset($_POST[$rows[$i]['id']])) {
			$wrote += 1;

			$status = $_POST[$rows[$i]['id']] == $rows[$i]['correct'] ? "pass" : "fail";
			if ($status == "pass") {
				$pass += 1;
			}

			//save progress
			db_insert("response_progress",[
				'exam' => $exam_data['id'],
				'student' => $_SESSION['student_id'],
				'question' => $rows[$i]['id'],
				'answer' => $_POST[$rows[$i]['id']],
				'correct_answer' => $rows[$i]['correct'],
				'status' => $status,
				'ref' => $ref,
			]);
		}
	}

	//update correct values
	db_update("response_summary", [
		'wrote' => $wrote,
		'pass' => $pass,
		'fail' => $wrote - $pass,
		'score' => round(($pass/count($rows)) * 100, 2)
	], ['id' => $ref]);

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif (isset($_GET['getQuestions'])) {
	$rows = getAll("questions", ['exam' => $_GET['getQuestions']]);

	for ($i=0; $i < count($rows); $i++) { 
		$rows[$i]['options'] = getAll("options", ['question' => $rows[$i]['id']]);
	}

	//header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
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
	//get registered subjects
	$data = getData("registration", ['student' => $_SESSION['data']['id']]) ?: ['id' => 0, 'form' => 0, 'subjects' =>''];

	$subjects = explode(",", $data['subjects']);

	$rows = [
		['id'=>0,'name'=> 'All','checked' => false]
	];
	$read = $db->query("SELECT * FROM subjects");
	while ($row = $read->fetch_assoc()) {
		$row['checked'] = in_array($row['id'], $subjects);
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_POST['setRegistration'])) {
	$data = getData("registration", ['student' => $_SESSION['data']['id']]);

	$subjects = json_decode($_POST['subjects'], true) ?: [];
	$selected = [];

	foreach ($subjects as $row) {
		if (isset($row['checked'])) {
			if ($row['checked']) {
				array_push($selected, $row['id']);
			}
		}
	}

	if ($data != null) {
		db_update("registration", [
			'subjects' => implode(",", $selected),
			'form' => $_POST['form']
		], ['id' => $data['id']]);
	}
	else{
		db_insert("registration", [
			'student' => $_SESSION['data']['id'],
			'form' => $_POST['form'],
			'subjects' => implode(",", $selected),
		]);
	}

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif (isset($_GET['getRegistration'])) {
	$data = getData("registration", ['student' => $_SESSION['data']['id']]) ?: ['id' => 0, 'form' => 0, 'subjects' =>''];

	if ($data['subjects'] != '') {
		$subjects = [];
		$read = $db->query("SELECT * FROM subjects WHERE id IN ({$data['subjects']})");
		while ($row = $read->fetch_assoc()) {
			array_push($subjects, $row);
		}
		$data['subjects'] = json_encode($subjects);
	}

	$data['form'] = (int)$data['form'];

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($data);
}
elseif (isset($_GET['getUser'])) {

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode(getData("students", [
		'id' => $_SESSION['data']['id']
	]));
}

elseif (isset($_POST['saveRef'], $_POST['type'])) {
	db_delete("progress", ['student' => $_SESSION['student_id'], 'type' => $_POST['type']]);

	db_insert("progress", [
		'student' => $_SESSION['student_id'],
		'ref' => $_POST['saveRef'],
		'type' => $_POST['type'],
		'date_added' => $time,
	]);

	if (isset($_POST['package'])) {
		db_insert("progress", [
			'student' => $_SESSION['student_id'],
			'ref' => $_POST['package'],
			'type' => $_POST['saveRef'],
			'date_added' => $time,
		]);
	}

	echo json_encode(['status' => true, 'message' => "Success"]);
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

	$read = $db->query("SELECT * FROM lessons WHERE form = '$form' AND subject = '$subject' AND active_from >= $time AND active_to <= $time ORDER BY id DESC");
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
else{
	echo json_encode(['status' => false, 'message' => "No data - ".json_encode($_POST)]);
}