<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="style.css">
    <title>TaskPlanner | Registration</title>
  </head>
  <body>
    <div class="wrapper">
      <p id="logo">TaskPlanner</p>
      <br>
      Registration
      <form id="register-form" action="auth.php" method="post">
        <input id="login" class="text-input" type="text" name="login" placeholder="Login">
        <br>
        <input id="password" class="text-input" type="password" name="password" placeholder="Password">
        <br>
        <p id="submit-register" class="accept-button">OK</p>
      </form>
      <p id="auth-result"></p>
      <br> or <br><br>
      <a class="register" href="index.php">Login with your account</a>
    </div>
  </body>
  <script src="js/ajax.js"></script>
  <script src="js/register.js"></script>
</html>
