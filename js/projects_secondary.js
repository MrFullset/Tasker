/**
This is a file with js functions for projects.php. Using ajax.js


Methods:
  timeUpdate() - updates time on the page.
  minusProject() - decreases project quantity.
  plusProject() - increases project quantity.
  quit_Clicked() - Click handler for Quit button. Sends request to server.
    Jumps to index.php

**/

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
