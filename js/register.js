document.getElementById("submit-register").onclick = function() { Registration();}

function Registration(){
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
  SendRequest('post', '../auth.php', 'type=register&login=' + login + '&password=' + password, resultHandler);
}

function resultHandler(result){

  switch (result) {
    case '1':
      window.location.replace('index.php');
      break;
    case '0':
      document.getElementById('auth-result').innerHTML = "Login is already used!";
      break;
    default:
      document.getElementById('auth-result').innerHTML = "Error occurred";
      console.log(result);
      break;
  }
}
