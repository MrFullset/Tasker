document.getElementById("submit-login").onclick = function() { Auth();}

function Auth(){
  var login = document.getElementById("login").value;
  var password = document.getElementById("password").value;

  if(login.length > 31){
    alert("Incorrect length of login! (0, 30) symbols");
    return;
  }
  if(password.length > 31){
    alert("Incorrect length of password! (0, 30) symbols");
    return;
  }

  SendRequest('post', '../auth.php', 'type=auth&login=' + login + '&password=' + password, resultHandler);
}

function resultHandler(result){

  switch (result) {
    case '1':
      window.location.replace('projects.php');
      break;
    case '-1':
      document.getElementById('auth-result').innerHTML = "Incorrect login!";
      break;
    case '-2':
      document.getElementById('auth-result').innerHTML = "Incorrect password!";
      break;
    default:
      document.getElementById('auth-result').innerHTML = "Error occurred";
      console.log(result);
      break;
  }
}
