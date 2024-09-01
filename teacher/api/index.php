<?php
session_start();
require '../../db.php';
require '../../functions.php';
//require '../../imageClass.php';
require '../../includes/String.php';
$time = time();

$student_id = $_SESSION['user_id'];

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
	echo json_encode($_SESSION['data']);
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
	$read = $db->query("SELECT * FROM admins");
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