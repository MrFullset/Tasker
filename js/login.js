/**
This is a file with js functions for index.php. Using ajax.js

Global variables:
  isResponsePositive - Server's response status

Global listeners:
  submit-login - Submit login button

Methods:
  onload - Starts on page load. Sets listeners to login and password fields
  checkString(string, lengthFrom, lengthTo) - Checks string by regular expression.
    Takes as arguments checking string and arrange of allowed lengths.
  Auth() - Tries to authenticate user with input credentials.
  resultHandler(result) - Handles a response from server.
**/
window.isResponsePositive = true;
window.onload = function(){
  var login = document.getElementById('login');
  var password = document.getElementById('password');

  login.addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13)
      Auth();
  }, false);

  password.addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13)
      Auth();
  }, false);
}

document.getElementById("submit-login").onclick = function() { Auth();}

function checkString(string, lengthFrom, lengthTo){
  var regExp = new RegExp('^[^\'\";()]{'+ lengthFrom +','+ lengthTo +'}$');
  return regExp.test(string);
}

function Auth(){
  var login = document.getElementById("login").value;
  var password = document.getElementById("password").value;

  if(!checkString(login, 1, 30)){
    alert("Incorrect login format!\nMust have 1-30 symbols\nNot allowed \' \" ; ( )");
    return;
  }
  if(!checkString(password, 6, 30)){
    alert("Incorrect password format!\nMust have 6-30 symbols\nNot allowed \' \" ; ( )");
    return;
  }

  SendRequest('post', '../auth.php', 'type=auth&login=' + login + '&password=' + password, resultHandler);
  document.getElementById('auth-result').innerHTML = "Working";
  setInterval(function(){
    if(isResponsePositive)
      document.getElementById('auth-result').innerHTML += ".";
  }, 700);
}

function resultHandler(result){
  switch (result) {
    case '1':
      window.location.replace('projects.php');
      break;
    case '-1':
      document.getElementById('auth-result').innerHTML = "Incorrect login!";
      window.isResponsePositive = false;
      break;
    case '-2':
      document.getElementById('auth-result').innerHTML = "Incorrect password!";
      window.isResponsePositive = false;
      break;
    default:
      document.getElementById('auth-result').innerHTML = "Error occurred";
      window.isResponsePositive = false;
      console.log(result);
      break;
  }
}
