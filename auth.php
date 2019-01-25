<?php
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
        $_SESSION['user'] = serialize($tryUser);
        echo $result;
        break;
        case -1:
        case -2:
          echo $result;
          break;
      default:
        echo 'E';
        break;
      }
        break;

  case 'register':
    $user = User::Register($_POST['login'], $_POST['password']);
    if($user != NULL)
      echo 1;
    else
      echo 0;
    break;
  default:
    break;
}



?>
