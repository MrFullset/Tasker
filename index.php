<?php
require_once("classes/MySQLProvider.php");
require_once("classes/User.php");
session_start();

if(isset($_SESSION['user'])){
  $user = unserialize($_SESSION['user']);
  if($user->getID() != -1){
    header('Location: projects.php');
  }
}

?>


<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="style.css">
    <title>TaskPlanner</title>
  </head>
  <body>
    <div class="wrapper">
      <p id="logo">TaskPlanner</p>
      <br>
      <form id="login-form" action="auth.php" method="post">
        <input id="login" class="text-input" type="text" name="login" placeholder="Login">
        <br>
        <input id="password" class="text-input" type="password" name="password" placeholder="Password">
        <br>
        <p id="submit-login" class="accept-button">OK</p>
      </form><br>
      <p id="auth-result"></p>
      <br> or <br><br>
      <a class="register" href="register.php">Register a new account</a>
    </div>
  </body>
  <script src="js/ajax.js"></script>
  <script src="js/login.js"></script>
</html>
