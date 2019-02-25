/**
This is a file with js functions for register.php. Using ajax.js

Global variables:
  isResponsePositive - Server's response status

Global listeners:
  submit-register - Submit registration button

Methods:
  onload - Starts on page load. Sets listeners to login and password fields
  checkString(string, lengthFrom, lengthTo) - Checks string by regular expression.
    Takes as arguments checking string and arrange of allowed lengths.
  Registration() - Tries to register user with input credentials.
  resultHandler(result) - Handles a response from server.
**/

document.getElementById("submit-register").onclick = function() { Registration();}
window.isResponsePositive = true;
window.onload = function(){
  var login = document.getElementById('login');
  var password = document.getElementById('password');

  login.addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13)
      Registration();
  }, false);

  password.addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key === 13)
      Registration();
  }, false);
}

function checkString(string, lengthFrom, lengthTo){
  var regExp = new RegExp('^[^\'\";()]{'+ lengthFrom +','+ lengthTo +'}$');
  return regExp.test(string);
}

function Registration(){
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
  SendRequest('post', '../auth.php', 'type=register&login=' + login + '&password=' + password, resultHandler);
  document.getElementById('auth-result').innerHTML = "Working";
  setInterval(function(){
    if(window.isResponsePositive)
      document.getElementById('auth-result').innerHTML += ".";
  }, 700);
}

function resultHandler(result){
  switch (result) {
    case '1':
      window.location.replace('index.php');
      break;
    case '0':
      document.getElementById('auth-result').innerHTML = "Login is already used!";
      window.isResponsePositive = false;
      break;
    default:
      document.getElementById('auth-result').innerHTML = "Error occurred";
      window.isResponsePositive = false;
      console.log(result);
      break;
  }
}
