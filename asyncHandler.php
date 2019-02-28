<?php
/**
This file provides access to backend with AJAX.
Handles frontend requests from page /projects.php

All requests must be sent with POST method. Must be variable 'type' which
contains one of following types. By default server sends back 1 if request
was done successfully and 0 if unsuccessfully. If request is attempt to
access to another user's data returns error.

Allowed requests:

  checkBoxChanged:
    Updates task status.
    Needed variables:
      'task_id' - ID of task

  deleteTask:
    Deletes task.
    Needed variables:
      'task_id' - ID of task

  deleteProject:
    Deletes project and all connected tasks.
    Needed variables:
      'project_id' - ID of project

  projectNameChange:
    Changes project's name.
    Needed variables:
      'project_id' - ID of project
      'name' - new name of project

  taskNameChange:
    Changes task's name.
    Needed variables:
      'task_id' - ID of task
      'name' - new name of task

  addNewProject:
    Adds new project.
    Needed variables:
      'name' - new name of project
    Returned values:
      Project's ID if success
      -1 if fails

  addNewTask:
    Adds new task to project.
    Needed variables:
      'name' - new name of task
      'project_id' - project's ID which is modificating
    Returned values:
      Task's ID if success
      -1 if fails

  priotirizeTaskToProject:
    Priotirize task to an another project. Deletes source task and creates new
      project
    Needed variables:
      'task_name' - new name of task
      'task_id' - task's ID
    Returned values:
      Project's ID if success
      -1 if fails

  quit:
    Quits from current user's session.

Server also could return specific error code in case of errors:

  ERROR1 - variable 'user' doesn't exist in session
  ERROR2 - serialized User instance doesn't exists in session
  ERROR3 - type of request wasn't sent
  ERROR4 - type of request isn't from allowed list
**/



require_once("classes/MySQLProvider.php");
require_once("classes/User.php");
require_once("classes/Project.php");
require_once("classes/Task.php");
require_once("classes/StringChecker.php");

session_start();

//is var with serialized user exists
if(!isset($_SESSION['user'])){
  echo "ERROR1";
  exit();
}
else{
  //is unserialized var instace of User
  $user = unserialize($_SESSION['user']);
  if(!isset($user) || $user->getID() == -1){
    echo "ERROR2";
    exit();
  }
  //is request type was sent
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
    //is name in allowed arrange
    if(!StringChecker::Check('innerHTML', $_POST['name'])){
      echo 0;
      return;
    }
    $project = new Project($_POST['project_id']);
    $name = $_POST['name'];
    if($user->getID() == $project->getUserID()){
      $project->UpdateName($name);
      echo 1;
    }
    else echo 0;
    break;
  case 'taskNameChange':
    //is name in allowed arrange
    if(!StringChecker::Check('innerHTML', $_POST['name'])){
      echo 0;
      return;
    }
    $task = new Task($_POST['task_id']);
    $name = $_POST['name'];
    if($user->getID() == $task->getUserID()){
      $task->UpdateName($name);
      echo 1;
    }
    else echo 0;
    break;
  case 'addNewProject':
    //is name in allowed arrange
    if(!StringChecker::Check('innerHTML', $_POST['name'])){
      echo 0;
      return;
    }
    $name = $_POST['name'];
    $project = Project::Create($name, $user->getID());
    echo $project->getID();
    break;
  case 'addNewTask':
    //is name in allowed arrange
    if(!StringChecker::Check('innerHTML', $_POST['name'])){
      echo 0;
      return;
    }
    $name = $_POST['name'];
    $task = Task::Create($name, $_POST['project_id']);
    echo $task->getID();
    break;
  case 'quit':
    unset($user);
    session_regenerate_id(true);
    $_SESSION = array();
    break;
  case 'priotirizeTaskToProject':
    //is name in allowed arrange
    if(!StringChecker::Check('innerHTML', $_POST['name'])){
      echo 0;
      return;
    }
    $taskID = $_POST['task_id'];
    $name =  $_POST['task_name'];
    $task = new Task($taskID);
    $project = Project::Create($name, $user->getID());
    $task->Delete();
    echo $project->getID();
    break;
  default:
    //type of request isn't from allowed list
    echo "ERROR4";
    break;
}

$mysql->Disconnect();

?>
