<?php
require_once("classes/MySQLProvider.php");
require_once("classes/User.php");
require_once("classes/Project.php");
require_once("classes/Task.php");
session_start();

if(!isset($_SESSION['user'])){
  echo "ERROR1";
  exit();
}
else{
  $user = unserialize($_SESSION['user']);
  if(!isset($user) || $user->getID() == -1){
    echo "ERROR2";
    exit();
  }
  if(!isset($_POST['type'])){
    echo 'ERROR3';
    exit();
  }
}

$type = $_POST['type'];
$mysql = new MySQLProvider();
$mysql->Connect();

switch ($type) {
  case 'checkBoxChanged':
    $task = new Task($_POST['task_id']);
    if($user->getID() == $task->getUserID()){
      $task->ChangeState();
      echo 1;
    }
    else echo 0;
    break;
  case 'deleteTask':
    $task = new Task($_POST['task_id']);
    if($user->getID() == $task->getUserID()){
      $task->Delete();
      echo 1;
    }
    else echo 0;
    break;
  case 'deleteProject':
    $project = new Project($_POST['project_id']);
    if($user->getID() == $project->getUserID()){
      $project->Delete();
      echo 1;
    }
    else echo 0;
    break;
  case 'projectNameChange':
    if(strlen($_POST['name']) > 31){
      echo 0;
      return;
    }
    $project = new Project($_POST['project_id']);
    if($user->getID() == $project->getUserID()){
      $project->UpdateName($_POST['name']);
      echo 1;
    }
    else echo 0;
    break;
  case 'taskNameChange':
    if(strlen($_POST['name']) > 31){
      echo 0;
      return;
    }
    $task = new Task($_POST['task_id']);
    if($user->getID() == $task->getUserID()){
      $task->UpdateName($_POST['name']);
      echo 1;
    }
    else echo 0;
    break;
  case 'addNewProject':
    if(strlen($_POST['name']) > 31){
      echo -1;
      return;
    }
    $project = Project::Create($_POST['name'], $user->getID());
    echo $project->getID();
    break;
  case 'addNewTask':
    if(strlen($_POST['name']) > 31){
      echo -1;
      return;
    }
    $task = Task::Create($_POST['name'], $_POST['project_id']);
    echo $task->getID();
    break;
  case 'quit':
    unset($user);
    session_regenerate_id(true);
    $_SESSION = array();
    break;
  default:
    echo "ERROR4";
    break;
}

$mysql->Disconnect();

?>
