<?php
session_start();
require '../../db.php';
require '../../functions.php';
//require '../../imageClass.php';
require '../../includes/String.php';
$time = time();

$student_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 1;

if (isset($_GET['getSettings2'])) {
	$data = [];

	$read = $db->query("SELECT * FROM config");
	while ($row = $read->fetch_assoc()) {
		$data[$row['name']] = $row['value'];
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
	echo json_encode(getData("staff", [
		'id' => $_SESSION['data']['id']
	]));
}
elseif (isset($_GET['getQuestions'])) {
	$rows = getAll("questions", ['exam' => $_GET['getQuestions']]);

	for ($i=0; $i < count($rows); $i++) { 
		$rows[$i]['options'] = getAll("options", ['question' => $rows[$i]['id']]);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif (isset($_GET['getExams'])) {
	$subjects = getAll("subjects", "id");
	$instructors = getAll("staff", "id");

	$rows = [];
	$rquery = $db->query("SELECT * FROM `exams`");
	while ($row = $rquery->fetch_assoc()) {
		$row['subject_data'] = $subjects[$row['subject']];
		$row['instructor_data'] = $instructors[$row['instructor_id']];
		$questions = getAll("questions", ['exam' => $row['id']]);

		for ($i=0; $i < count($questions); $i++) { 
			$questions[$i]['options'] = getAll("options", ['question' => $questions[$i]['id']]);
		}

		$row['questions'] = $questions;

		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif(isset($_POST['exam_id'], $_POST['question_stmt'], $_POST['numOptions'])){
	$attachment = "";
	if (isset($_FILES['attachment'])) {
		$attachment = $_FILES['attachment']['name'];

		move_uploaded_file($_FILES['attachment']['tmp_name'], "../../uploads/".$attachment);
	}

	//save exam
	$insert_id = db_insert("questions",[
		'exam' => $_POST['exam_id'],
		'question' => $_POST['question_stmt'],
		'attachment' => $attachment,
	]);

	for ($i=0; $i < (int)$_POST['numOptions']; $i++) { 

		db_insert("options", [
			'question' => $insert_id,
			'label' => $_POST['label'.$i],
			'value' => $_POST['value'.$i],
			'type' => (int)$_POST['correct'] == $i ? "correct" : 'wrong',
		]);
	}

	$options = getAll("options", ['question' =>$insert_id]);

	echo json_encode([
		'status' => true, 
		'message' => "Added",
		//'stmt' => $_POST['question_stmt'],
		//'options' => $options
	]);
}
elseif(isset($_POST['exam_name'], $_POST['course_id'], $_POST['form'], $_POST['term'])){
	db_insert("exams", [
		'form' => $_POST['form'],
		'term' => $_POST['term'],
		'subject' => $_POST['course_id'],
		'title' => $_POST['exam_name'],
		'instructor_id' => $_SESSION['user_id'],
		'created_at' => $time,
		'status' => 'active',
	]);

	echo json_encode(['status' => true, 'message' => "Added"]);
}
elseif (isset($_FILES['change_picture'])) {
	$filename = $_FILES['change_picture']['name'];

	if (move_uploaded_file($_FILES['change_picture']['tmp_name'], "../../uploads/$filename")) {
		db_update("staff", [
			'picture' => $filename
		], ['id' => $_SESSION['data']['id']]);

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

		$row['start_active_day'] = date('Y-m-d', $row['active_from']);
		$row['end_active_day'] = date('Y-m-d', $row['active_to']);
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif(isset($_POST['lesson_id'], $_POST['start_date'], $_POST['end_date'])){
	db_update("lessons", [
		'active_from' => strtotime($_POST['start_date']),
		'active_to' => strtotime($_POST['end_date']." 23:59"),
	], ['id' => $_POST['lesson_id']]);

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif(isset($_POST['lesson_id'], $_POST['new_comment'])){
	db_insert("comments", [
		'user' => $_SESSION['user_id'],
		'user_type' => 'teacher',
		'comment' => $_POST['new_comment'],
		'date_added' => $time,
		'status' => 'active',
		'ref' => $_POST['lesson_id'],
		'parent' => (int)$_POST['parent']
	]);

	echo json_encode(['status' => true, 'message' => "Success"]);
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
elseif(isset($_POST['subject_resources'], $_POST['form'])){
	$subject = (int)$_POST['subject_resources'];
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

	$read = $db->query("SELECT * FROM books WHERE form = '$form' AND subject = '$subject' ");
	while ($row = $read->fetch_assoc()) {
		$row['admin_data'] = $admins[$row['admin']];
		$row['subject_data'] = $subjects[$row['subject']];
		$row['date'] = date('d-M-Y', $row['date_added']);
		array_push($rows, $row);
	}

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($rows);
}
elseif(isset($_POST['subject'], $_POST['new_book_title'], $_POST['author'], $_FILES['file'])){
	if (move_uploaded_file($_FILES['file']['tmp_name'], "../../uploads/".$_FILES['file']['name'])) {
		db_insert("books", [
			'title' => $_POST['new_book_title'],
			'author' => $_POST['author'],
			'image' => "default_cover.jpg",
			'file' => $_FILES['file']['name'],
			'subject' => $_POST['subject'],
			'date_added' => $time,
			'admin' => $_SESSION['user_id'],
			'form' => $_POST['form'],
			'type' => $_POST['type']
		]);

		echo json_encode(['status' => true, 'message' => "Success"]);
	}
	else{
		echo json_encode(['status' => false, 'message' => "Success"]);
	}
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
elseif(isset($_POST['toggleLike'])){
	$check = getData("likes", ['user' => $_SESSION['student_id'], 'post' => $_POST['toggleLike']]);
	if ($check == null) {
		db_insert("likes", [
			'user' => $_SESSION['student_id'],
			'post' => $_POST['toggleLike'],
			'type' => 'comment',
			'date_added' => $time,
		]);

		echo json_encode([
			'status' => true,
			'message' => "Success",
			'hasLiked' => true
		]);
	}
	else{
		db_delete("likes", ['id' => $check['id']]);

		echo json_encode([
			'status' => true,
			'message' => "Success",
			'hasLiked' => false
		]);
	}
}
elseif (isset($_POST['deleteResource'], $_POST['id'])) {
	$data = getData("books", ['id' => (int)$_POST['id']]);

	if (file_exists("../../uploads/".$data['file'])) {
		unlink("../../uploads/".$data['file']);
	}

	db_delete("books", ['id' => (int)$_POST['id']]);
	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif(isset($_POST['resource_id'], $_POST['subject'], $_POST['type'], $_POST['edit_book_title'], $_POST['author'])){
	db_update("books", [
		'subject' => $_POST['subject'],
		'type' => $_POST['type'],
		'title' => $_POST['edit_book_title'],
		'author' => $_POST['author']
	], ['id' => $_POST['resource_id']]);

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif(isset($_POST['subject'], $_POST['form'], $_POST['new_lesson_title'], $_POST['description'])){
	//
	$lesson_id = db_insert("lessons", [
		'teacher' => $_SESSION['user_id'],
		'title' => $_POST['new_lesson_title'],
		'text' => $_POST['description'],
		'status' => "active",
		'subject' => $_POST['subject'],
		'form' => $_POST['form'],
		'date_added' => $time,
		'active_from' => $time,
		'active_to' => $time + (24*7*3600)
	]);

	for ($i=0; $i < $_POST['attachments']; $i++) { 
		$filename = $_FILES['attachment'.$i]['name'];

		move_uploaded_file($_FILES['attachment'.$i]['tmp_name'], "../../uploads/".$filename);

		db_insert("attachments", [
			'filename' => $filename,
			'ref' => $lesson_id,
			'type' => 'lesson',
		]);
	}

	echo json_encode(['status' => true, 'message' => "Success"]);
}
elseif(isset($_POST['deleteLesson'], $_POST['id'])){
	$attachments = getAll("attachments", ['ref' => $_POST['id'], 'type' => 'lesson']);

	foreach ($attachments as $row) {
		if (file_exists("../../uploads/".$row['filename'])) {
			unlink("../../uploads/".$row['filename']);
		}
	}

	db_delete("attachments", ['ref' => $_POST['id'], 'type' => 'lesson']);

	db_delete("lessons", ['id' => $_POST['id']]);

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