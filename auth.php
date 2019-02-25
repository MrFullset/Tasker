<?php
/**
This file provides access to backend with AJAX.
Handles frontend requests from page /index.php and /register.php

All requests must be sent with POST method. Must be variable 'type' which
contains one of following types. Also must be sent variables 'login' and
'password'.

Allowed requests:

  auth:
    Makes attempt to authenticate user with sended credentials
    Returned values:
       1 - success
      -1 - login is incorrect
      -2 - password is incorrect
      E - error occurred

  register:
    Makes attempt to register user with sended credentials
    Returned values:
       1 - success
       0 - user exists


**/

require_once("classes/MySQLProvider.php");
require_once("classes/User.php");


session_start();

$login = $_POST['login'];
$password = $_POST['password'];
$type = $_POST['type'];


if(strlen($login) > 31){
  echo -1;
  return;
}
if(strlen($password) > 31){
  echo -2;
  return;
}

switch ($type) {
  case 'auth':
    $tryUser = new User($login, $password);
    $result = $tryUser->Auth();
    switch ($result) {
      case 1:
        //serialize user to session to use in future
        $_SESSION['user'] = serialize($tryUser);
        echo $result;
        break;
        case -1: //incorrect login
        case -2: //incorrect password
          echo $result;
          break;
      default:
        echo 'E'; //error occured
        break;
      }
        break;

  case 'register':
    $user = User::Register($_POST['login'], $_POST['password']);
    if($user != NULL)
      echo 1;
    else
      echo 0; //user exists
    break;
  default:
    break;
}



?>
