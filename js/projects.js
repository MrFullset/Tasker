/*
This is a file with js functions for projects.php. Using ajax.js

Global listeners:
  project-name        (DblClick)
  project-delete      (Click)
  add-new-project     (Click)
  task-checkbox       (Click)
  task-delete         (Click)
  task-name           (DblClick)
  add-new-task        (Click)
  task-priotirize     (Click)
  quit                (Click)
  projectAdd_onClick  (Click)
  quitButton_onClick  (Click)

Methods:
  updateEventListeners()
    Updates all event listeners on page. Used when some element were dynamicly
    added to page

  taskDelete_Clicked()
    Deletes task. Calls when task-delete got clicked

  taskPriotirizes_Clicked()
    Priotirize task. Calls when task-priotirize got clicked

  taskAdds_Clicked()
    Add new task. Calls when add-new-task got clicked

  discardAddTask_Click()
    Removes page on previous state before task was created.
    Calls when task-delete got clicked on unfilled task.

  taskState_Changed()
    Updates task status. Calls when task-checkbox got clicked

  addNewTask_Done()
    Handles adding new task after server response

  taskName_Out()
    Calls when unfilled task comes out from focus

  addNewTask_KeyPressed(e)
    Handles keypressing on unfilled task name field. If Enter button pressed
    calls addNewTask_Done()

  addNewProject()
    Adds new project. Calls when projectAdd got clicked

  discardAddProject_Click()
    Removes page on previous state before project was created.
    Calls when project-delete got clicked on unfilled project.

  addNewProject_Done(e)
    Handles adding new project after server response

  projectName_DblClicked()
    Makes input box of label to edit project's name. Prepares project to change
    name. Calls when project-name got double clicked

  taskNames_DblClicked()
    Makes input box of label to edit project's name. Prepares task to change
    name. Calls when task-name got double clicked

  projectName_Out(e)
    Calls when unfilled project comes out from focus

  taskName_Changed(e)
    Updates task name. Calls when task-name got updated

  projectDelete_Clicked()
    Deletes project. Calls when project-delete got clicked

  projectName_Changed(e)
    Updates project name. Calls when project-name got updated

  checkString(type, string)
    Checks if input matching to the pattern. Takes as arguments TYPE (list below)
    and STRING.
    Allowed types:
      'innerHTML' - simple text strings
      'id'        - ids


 *unfilled task|project means task|project, that was created by user, but
  wasn't submitted by Enter
*/



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

function checkString(type, string){
  switch (type) {
    case 'innerHTML':
      var regExp = new RegExp('^[^\'\";()<>]{1,30}$');
      return regExp.test(string);
      break;
    case 'id':
      var regExp = new RegExp('^[1-9]+$');
      return regExp.test(string);
      break;
  }
}

function taskDelete_Clicked(){
  var taskID = this.parentElement.getAttribute("task_id");
  if(taskID != "null"){
    if(!checkString('id', taskID)){
      alert('Modified ID!')
      return;
    }
  }

  this.parentElement.remove();
  SendRequest('post', '../asyncHandler.php', 'type=deleteTask&task_id=' + taskID, function(){});
}

function taskPriotirizes_Clicked(){
  if(!checkString('innerHTML', this.previousSibling.previousSibling.innerText)){
    alert('Incorrect format! 1-30 symbols. Not allowed \' \" ; ( ) < >')
    return;
  }
  if(!checkString('id', this.parentElement.getAttribute("task_id"))){
    alert('Modified ID!')
    return;
  }

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
  if(!checkString('id', task.getAttribute("task_id"))){
    alert('Modified ID!')
    return;
  }

  var taskID = task.getAttribute("task_id");
  SendRequest('post', '../asyncHandler.php', 'type=checkBoxChanged&task_id=' + taskID, function(){});
  if(!this.checked)
    this.removeAttribute('checked');
  else
    this.setAttribute('checked', '');
}

function addNewTask_Done(parent){
  if(!checkString('innerHTML', parent.firstChild.value)){
    alert('Incorrect format! 1-30 symbols. Not allowed \' \" ; ( ) < >')
    return;
  }
  if(!checkString('id', parent.parentElement.parentElement.parentElement.getAttribute('project_id'))){
    alert('Modified ID!')
    return;
  }

  window.updTaskName.removeEventListener("keypress", addNewTask_KeyPressed, false);
  var taskName = parent.firstChild.value;
  var projectID = parent.parentElement.parentElement.parentElement.getAttribute('project_id');
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
  if(!checkString('innerHTML', e.firstChild.value)){
    alert('Incorrect format! 1-30 symbols. Not allowed \' \" ; ( ) < >')
    return;
  }
  if(!checkString('id', e.parentElement.getAttribute("task_id"))){
    alert('Modified ID!')
    return;
  }

  var taskName = e.firstChild.value;
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
    if(!checkString('innerHTML', this.firstChild.value)){
      alert('Incorrect format! 1-30 symbols. Not allowed \' \" ; ( ) < >')
      return;
    }
    window.updProjectName.removeEventListener("keypress", addNewProject_Done, false);
    var projectName = this.firstChild.value;
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
  if(!checkString('innerHTML', e.firstChild.value)){
    alert('Incorrect format! 1-30 symbols. Not allowed \' \" ; ( ) < >')
    return;
  }
  if(!checkString('id', e.parentElement.parentElement.getAttribute("project_id"))){
    alert('Modified ID!')
    return;
  }

  var projectName = e.firstChild.value;
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

    if(!checkString('innerHTML', taskName)){
      alert('Incorrect format! 1-30 symbols. Not allowed \' \" ; ( ) < >')
      return;
    }
    if(!checkString('id', this.parentElement.getAttribute("task_id"))){
      alert('Modified ID!')
      return;
    }

    var taskID = this.parentElement.getAttribute("task_id");
    SendRequest('post', '../asyncHandler.php', 'type=taskNameChange&task_id=' + taskID + '&name=' + taskName, function(){});
    this.innerHTML = taskName;
    window.updTaskName = 0;
  }
}

function projectDelete_Clicked(){
  if(!checkString('id', this.parentElement.parentElement.getAttribute("project_id"))){
    alert('Modified ID!')
    return;
  }

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
    if(!checkString('innerHTML', this.firstChild.value)){
      alert('Incorrect format! 1-30 symbols. Not allowed \' \" ; ( ) < >');
      return;
    }
    if(!checkString('id', this.parentElement.parentElement.getAttribute("project_id"))){
      alert('Modified ID!')
      return;
    }

    var projectName = this.firstChild.value;
    var projectID = this.parentElement.parentElement.getAttribute("project_id");
    SendRequest('post', '../asyncHandler.php', 'type=projectNameChange&project_id=' + projectID + '&name=' + projectName, function(){});
    this.innerHTML = projectName;
    window.updProjectName = 0;
  }


}
