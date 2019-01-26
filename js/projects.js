window.onload = function(){
  updateEventListeners();
  setInterval(timeUpdate, 5000);
}

function updateEventListeners(){
  var projectNames = document.getElementsByClassName('project-name');
  var projectDeletes = document.getElementsByClassName('project-delete');
  var projectAdd = document.getElementById('add-new-project');

  var checkBoxes = document.getElementsByClassName('task-checkbox');
  var taskDeletes = document.getElementsByClassName('task-delete');
  var taskNames = document.getElementsByClassName('task-name');
  var taskAdds = document.getElementsByClassName('add-new-task');

  var quitButton = document.getElementById('quit');

  projectAdd.onclick = function(){addNewProject();}
  quitButton.onclick = function(){quit_Clicked();}

  for(var i = 0; i < checkBoxes.length; i++)
    checkBoxes[i].addEventListener("click", function(){
      var taskID = this.parentElement.getAttribute("task_id");
      SendRequest('post', '../asyncHandler.php', 'type=checkBoxChanged&task_id=' + taskID, function(res){console.log(res);});
    }, false)

  for(var i = 0; i < projectNames.length; i++)
    projectNames[i].addEventListener("dblclick", projectName_DblClicked, false)

  for(var i = 0; i < taskDeletes.length; i++)
    taskDeletes[i].addEventListener("click", taskDelete_Clicked, false);

  for(var i = 0; i < projectDeletes.length; i++)
    projectDeletes[i].addEventListener("click", projectDelete_Clicked, false);

  for(var i = 0; i < taskNames.length; i++)
    taskNames[i].addEventListener("dblclick", taskNames_DblClicked, false);

  for(var i = 0; i < taskAdds.length; i++)
    taskAdds[i].addEventListener("click", taskAdds_Clicked, false);

  window.updProjectName = 0;
  window.updTaskName = 0;
}

function taskAdds_Clicked() {
  var project = this.parentElement;
  project.children[1].innerHTML += '<div id="TE" task_id="null" class="task">'+
    '<input class="task-checkbox" type="checkbox"></input>'+
    '<p class="task-name">'+
      '<input class="task-name-edit" type="text" value="New Task">'+
    '</p>'+
    '<p class="task-delete">'+
      'X'+
    '</p>'+
  '</div>';

  if(window.updTaskName != 0){
    taskName_Out(window.updTaskName);
  }
  window.updTaskName = document.getElementById('TE').children[1];
  window.updTaskName.addEventListener("keypress", addNewTask_Done, false);
}

function addNewTask_Done(e){
  var key = e.which || e.keyCode;
  if (key === 13) {
    window.updTaskName.removeEventListener("keypress", addNewTask_Done, false);
    var taskName = this.firstChild.value;
    var projectID = this.parentElement.parentElement.parentElement.getAttribute('project_id');
    if(taskName.length <= 0 || taskName.length > 30){
      alert("Incorrect length! (0, 31) symbols");
      return;
    }

    SendRequest('post', '../asyncHandler.php', 'type=addNewTask&name=' + taskName + '&project_id=' + projectID, function(res){
      if(res == -1){
        alert("Error occured!");
        return;
      }
      var editing = document.getElementById('TE');
      editing.setAttribute('task_id', res);
      editing.id = "";
      updateEventListeners();
    });
    this.innerHTML = taskName;
    window.updTaskName = 0;
  }
}

function addNewProject(){
  var projects = document.getElementsByClassName('projects')[0];
  if(parseInt(document.getElementById('counter').innerText) == 0)
    projects.innerHTML = "";

  projects.innerHTML += '<div id="E" project_id="null" class="project">' +
    '<div class="project-header">'+
      '<div class="project-name">'+
        '<input class="project-name-edit" type="text" value="New Project">'+
      '</div>'+
      '<div class="project-delete">X</div>'+
    '</div>'+
    '<div class="tasks"></div>'+
    '<p class="add-new-task">Add new task</p>'+
  '</div>';

  if(window.updProjectName != 0){
    projectName_Out(window.updProjectName);
    console.log("ok");
  }
  window.updProjectName = document.getElementById('E').firstChild.firstChild;
  window.updProjectName.addEventListener("keypress", addNewProject_Done, false);
}

function addNewProject_Done(e){
  var key = e.which || e.keyCode;
  if (key === 13) {
    window.updProjectName.removeEventListener("keypress", addNewProject_Done, false);
    var projectName = this.firstChild.value;
    if(projectName.length <= 0 || projectName.length > 30){
      alert("Incorrect length! (0, 31) symbols");
      return;
    }
    SendRequest('post', '../asyncHandler.php', 'type=addNewProject&name=' + projectName, function(res){
      if(res == -1){
        alert("Error occured!");
        return;
      }
      var editing = document.getElementById('E');
      editing.setAttribute('project_id', res);
      editing.id = "";
    });
    this.innerHTML = projectName;
    updateEventListeners();
    plusProject();
  }
}

function projectName_DblClicked(){
  console.log("o");
  if(window.updProjectName != 0){
    projectName_Out(window.updProjectName);
    console.log("ok");
    return;
  }
  window.updProjectName = this;
  var projectID = this.parentElement.parentElement.getAttribute("project_id");
  this.innerHTML = '<input class="project-name-edit" type="text" value="'+ this.innerText +'">';
  this.addEventListener("keypress", projectName_Changed, false);
}

function taskNames_DblClicked(){
  if(window.updTaskName != 0){
    taskName_Out(window.updTaskName);
    console.log("ok");
    return;
  }
  window.updTaskName = this;
  var taskID = this.parentElement.getAttribute("task_id");
  this.innerHTML = '<input class="task-name-edit" type="text" value="'+ this.innerText +'">';
  this.addEventListener("keypress", taskName_Changed, false);
}

function projectName_Out(e){
  var projectName = e.firstChild.value;
  if(projectName.length <= 0 || projectName.length > 30){
    alert("Incorrect length! (0, 31) symbols");
    return;
  }
  var projectID = e.parentElement.parentElement.getAttribute("project_id");
  SendRequest('post', '../asyncHandler.php', 'type=projectNameChange&project_id=' + projectID + '&name=' + projectName, function(){});
  //console.log(projectID + " sent " + projectName);
  e.innerHTML = e.firstChild.value;
  window.updProjectName = 0;
}


function taskName_Out(e){
  var taskName = e.firstChild.value;
  if(taskName.length <= 0 || taskName.length > 30){
    alert("Incorrect length! (0, 31) symbols");
    return;
  }
  var taskID = e.parentElement.getAttribute("task_id");
  SendRequest('post', '../asyncHandler.php', 'type=taskNameChange&task_id=' + taskID + '&name=' + taskName, function(res){console.log(res);});
  e.innerHTML = taskName;
  window.updTaskName = 0;
}


function taskName_Changed(e){
  var key = e.which || e.keyCode;
  if (key === 13) {

    var taskName = (this.firstChild.value == undefined) ? this.firstChild.data : this.firstChild.value;
    if(taskName.length <= 0 || taskName.length > 30){
      alert("Incorrect length! (0, 31) symbols");
      return;
    }
    var taskID = this.parentElement.getAttribute("task_id");
    //console.log(taskName + ' ' + taskID);
    SendRequest('post', '../asyncHandler.php', 'type=taskNameChange&task_id=' + taskID + '&name=' + taskName, function(res){console.log(res);});
    this.innerHTML = taskName;
    window.updTaskName = 0;
  }
}

function projectDelete_Clicked(){
  var projectID = this.parentElement.parentElement.getAttribute("project_id");
  var projects = document.getElementsByClassName('projects')[0];
  this.parentElement.parentElement.remove();
  SendRequest('post', '../asyncHandler.php', 'type=deleteProject&project_id=' + projectID, function(){});
  minusProject();
  if(parseInt(document.getElementById('counter').innerText) == 0)
    projects.innerHTML = '<p class="no-project">You have no projects yet</p><br>';
}

function taskDelete_Clicked(){
  var taskID = this.parentElement.getAttribute("task_id");
  this.parentElement.remove();
  SendRequest('post', '../asyncHandler.php', 'type=deleteTask&task_id=' + taskID, function(res){console.log(res);});
}

function projectName_Changed(e){
  var key = e.which || e.keyCode;
  if (key === 13) {
    var projectName = this.firstChild.value;
    if(projectName.length <= 0 || projectName.length > 30){
      alert("Incorrect length! (0, 31) symbols");
      return;
    }
    var projectID = this.parentElement.parentElement.getAttribute("project_id");
    SendRequest('post', '../asyncHandler.php', 'type=projectNameChange&project_id=' + projectID + '&name=' + projectName, function(){});
    //console.log();
    this.innerHTML = projectName;
    window.updProjectName = 0;
  }
}
