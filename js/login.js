/**
This is a file with js functions for index.php. Using ajax.js

Global variables:
  isResponsePositive - Server's response status

Global listeners:
  submit-login - Submit login button

Methods:
  onload - Starts on page load. Sets listeners to login and password fields
  checkCredential(type, string) - Checks credential for matching to the pattern.
    Takes as args type(list below) and string.
    Types:
      'login' - login
      'pass' - password
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

function checkCredential(type, string){
  //Temporarily
  if(!type.localeCompare('pass') && !string.localeCompare('test123'))
    return true;
  switch (type) {
    case 'login':
      var regExp = new RegExp('^[^\'\";()]{1,30}$');
      return regExp.test(string);
    case 'pass':
      var regExp = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d][^\'\";()]{6,30}$');
      return regExp.test(string);
    default:
      return -1;
  }
}

function Auth(){
  var login = document.getElementById("login").value;
  var password = document.getElementById("password").value;

  if(!checkCredential('login', login)){
    document.getElementById('auth-result').innerHTML = "Incorrect login format! Must have 1-30 symbols. Not allowed \' \" ; ( )";
    return;
  }
  if(!checkCredential('pass', password)){
    document.getElementById('auth-result').innerHTML = "Incorrect password format! Must have 6-30 symbols, at least on capital and " +
     "number. Not allowed \' \" ; ( )";
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
    case 'ELF':
      document.getElementById('auth-result').innerHTML = "Incorrect login format! Must have 1-30 symbols. Not allowed \' \" ; ( )";
      window.isResponsePositive = false;
      break;
    case 'EPF':
      document.getElementById('auth-result').innerHTML = "Incorrect password format! Must have 6-30 symbols, at least on capital and " +
       "number. Not allowed \' \" ; ( )";
      window.isResponsePositive = false;
      break;
    default:
      document.getElementById('auth-result').innerHTML = "Error occurred";
      window.isResponsePositive = false;
      console.log(result);
      break;
  }
}
