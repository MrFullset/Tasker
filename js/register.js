document.getElementById("submit-register").onclick = function() { Registration();}
window.isResponsePositive = true;

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
