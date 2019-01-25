function timeUpdate(){
  var currentdate = new Date();
  var time = document.getElementById('time');
  time.innerText = ("0" + currentdate.getHours()).slice(-2) + ':' + ("0" + currentdate.getMinutes()).slice(-2);
}

function minusProject(){
  var counter = document.getElementById('counter');
  var count = parseInt(counter.innerText) - 1;
  counter.innerText = count;
}

function plusProject(){
  var counter = document.getElementById('counter');
  var count = parseInt(counter.innerText) + 1;
  counter.innerText = count;
}

function quit_Clicked(){
  SendRequest('post', '../asyncHandler.php', 'type=quit', function (){});
  window.location.replace('index.php');
}
