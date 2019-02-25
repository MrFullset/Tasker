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
  var taskPriotirizes = document.getElementsByClassName('task-priotirize');

  var quitButton = document.getElementById('quit');

  projectAdd.onclick = function(){addNewProject();}
  quitButton.onclick = function(){quit_Clicked();}

  for(var i = 0; i < checkBoxes.length; i++)
    checkBoxes[i].addEventListener("click", taskState_Changed, false);

  for(var i = 0; i < projectNames.length; i++)
    projectNames[i].addEventListener("dblclick", projectName_DblClicked, false);

  for(var i = 0; i < taskDeletes.length; i++)
    taskDeletes[i].addEventListener("click", taskDelete_Clicked, false);

  for(var i = 0; i < projectDeletes.length; i++)
    projectDeletes[i].addEventListener("click", projectDelete_Clicked, false);

  for(var i = 0; i < taskNames.length; i++)
    taskNames[i].addEventListener("dblclick", taskNames_DblClicked, false);

  for(var i = 0; i < taskAdds.length; i++)
    taskAdds[i].addEventListener("click", taskAdds_Clicked, false);

  for(var i = 0; i < taskPriotirizes.length; i++)
    taskPriotirizes[i].addEventListener("click", taskPriotirizes_Clicked, false);

  window.updTaskName = (document.getElementById('TE') != null) ? document.getElementById('TE').children[1] : 0;
  window.updProjectName = (document.getElementById('E') != null) ? document.getElementById('E').firstChild.firstChild : 0;
}

function taskDelete_Clicked(){
  var taskID = this.parentElement.getAttribute("task_id");
  this.parentElement.remove();
  SendRequest('post', '../asyncHandler.php', 'type=deleteTask&task_id=' + taskID, function(){});
}

function taskPriotirizes_Clicked(){
  var taskID = this.parentElement.getAttribute("task_id");
  var taskName = this.previousSibling.previousSibling.innerText;
  var projects = document.getElementsByClassName('projects')[0];

  SendRequest('post', '../asyncHandler.php', 'type=priotirizeTaskToProject&task_id=' + taskID + '&task_name=' + taskName, function(res){
      projects.innerHTML += '<div project_id="'+ res +'" class="project">' +
        '<div class="project-header">'+
          '<div class="project-name">'+
            taskName +
          '</div>'+
          '<div class="project-delete">X</div>'+
        '</div>'+
        '<div class="tasks"></div>'+
        '<p class="add-new-task">Add new task</p>'+
      '</div>';
      updateEventListeners();
  });
  this.parentElement.remove();
}

function taskAdds_Clicked() {
  console.log('In : ' + window.updTaskName);
  if(window.updTaskName != 0){
    addNewTask_Done(window.updTaskName);
    console.log('freed');
  }

  var project = this.parentElement;
  project.children[1].innerHTML += '<div id="TE" task_id="null" class="task">'+
    '<input class="task-checkbox" type="checkbox"></input>'+
    '<p class="task-name">'+
      '<input class="task-name-edit" type="text" value="New Task">'+
    '</p>'+
    '<img class="task-priotirize" src="img/priotirize.png" alt="Priotirize task to project">' +
    '<img class="task-delete" src="img/delete.png" alt="Delete task">' +
  '</div>';
  var freshTask = document.getElementById('TE');

  window.updTaskName = freshTask.children[1];
  window.updTaskName.addEventListener("keypress", addNewTask_KeyPressed, false);

  freshTask.children[3].addEventListener('click', discardAddTask_Click, false);
  console.log('Out : ' + window.updTaskName);
  updateEventListeners();
}

function discardAddTask_Click(){
  window.updTaskName.removeEventListener('click', discardAddTask_Click, false);
  document.getElementById('TE').remove();
  window.updTaskName = 0;
  updateEventListeners();
}

function taskState_Changed(){
  var task = this.parentElement;
  var taskID = task.getAttribute("task_id");
  SendRequest('post', '../asyncHandler.php', 'type=checkBoxChanged&task_id=' + taskID, function(){});
  if(!this.checked)
    this.removeAttribute('checked');
  else
    this.setAttribute('checked', '');
}

function addNewTask_Done(parent){
  window.updTaskName.removeEventListener("keypress", addNewTask_KeyPressed, false);
  var taskName = parent.firstChild.value;
  var projectID = parent.parentElement.parentElement.parentElement.getAttribute('project_id');
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
  parent.innerHTML = taskName;
}

function taskName_Out(e){
  var taskName = e.firstChild.value;
  if(taskName.length <= 0 || taskName.length > 30){
    alert("Incorrect length! (0, 31) symbols");
    return;
  }
  var taskID = e.parentElement.getAttribute("task_id");
  SendRequest('post', '../asyncHandler.php', 'type=taskNameChange&task_id=' + taskID + '&name=' + taskName, function(){});
  e.innerHTML = taskName;
  updateEventListeners();
}

function addNewTask_KeyPressed(e){
  var key = e.which || e.keyCode;
  if (key === 13)
    addNewTask_Done(this);
}

function addNewProject(){
  if(window.updProjectName != 0)
    projectName_Out(window.updProjectName);
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

  var freshProject = document.getElementById('E');

  window.updProjectName = freshProject.firstChild.firstChild;
  window.updProjectName.addEventListener("keypress", addNewProject_Done, false);

  freshProject.firstChild.children[1].addEventListener("click", discardAddProject_Click, false);
}

function discardAddProject_Click(){
  window.updProjectName.removeEventListener("click", discardAddProject_Click, false);
  document.getElementById('E').remove();
  window.updProjectName = 0;
  updateEventListeners();
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
  if(window.updProjectName != 0)
    projectName_Out(window.updProjectName);

  window.updProjectName = this;
  var projectID = this.parentElement.parentElement.getAttribute("project_id");
  this.innerHTML = '<input class="project-name-edit" type="text" value="'+ this.innerText +'">';
  this.addEventListener("keypress", projectName_Changed, false);
}

function taskNames_DblClicked(){
  if(window.updTaskName != 0)
    taskName_Out(window.updTaskName);

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
  if(projectID == "null"){
    SendRequest('post', '../asyncHandler.php', 'type=addNewProject&name=' + projectName, function(res){
      if(res == -1){
        alert("Error occured!");
        return;
      }
      var editing = document.getElementById('E');
      editing.setAttribute('project_id', res);
      editing.id = "";
      editing.firstChild.firstChild.innerHTML = editing.firstChild.firstChild.firstChild.value;
      plusProject();
      updateEventListeners();
    });
  }
  else
    SendRequest('post', '../asyncHandler.php', 'type=projectNameChange&project_id=' + projectID + '&name=' + projectName, function(){});
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
    SendRequest('post', '../asyncHandler.php', 'type=taskNameChange&task_id=' + taskID + '&name=' + taskName, function(){});
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
    this.innerHTML = projectName;
    window.updProjectName = 0;
  }
}
