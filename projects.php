<?php
require_once("classes/MySQLProvider.php");
require_once("classes/User.php");
require_once("classes/Project.php");
require_once("classes/Task.php");
session_start();

if(!isset($_SESSION['user'])){
  header('Location: index.php');
}
else{
  $user = unserialize($_SESSION['user']);
  if(!isset($user) || $user->getID() == -1){
    header('Location: index.php');
  }
}

$id = $user->getID();
$login = $user->getLogin();

$projects = $user->GetData();
$tasksInProgressCount = 0;
foreach($projects as $project){
  foreach ($project->getTasks() as $task) {
    if($task->getStatus() == 0)
      $tasksInProgressCount++;
  }
}

?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="style.css">
    <title>TaskPlanner | Projects</title>
  </head>
  <body>
    <div class="wrapper">
      <div class="top">
        <ul>
          <li>Hello, <?php echo $login; ?></li>
          <li>Count of projects : <p id="counter"><?php echo count($projects); ?></p></li>
          <li id="time"><?php echo date("H:i"); ?></li>
          <li id="quit">Quit</li>
        </ul>
      </div>
      <p id="projects-logo">TaskPlanner</p>
        <div class="projects">
          <?php
            if(count($projects) == 0){
              echo '<p class="no-project">You have no projects yet</p><br>';
            }
            else{
              foreach ($projects as $project) {
                echo '
                <div project_id="'.$project->getID().'" class="project">
                  <div class="project-header">
                    <div class="project-name">
                      '.$project->getName().'
                    </div>
                    <div class="project-delete">X</div>
                  </div>
                  <div class="tasks">';
                    if(count($project->getTasks()) == 0){
                      //echo '<p class="add-new-task">Add new task</p>';
                    }
                    else{
                      foreach ($project->getTasks() as $task) {
                        echo '
                        <div task_id="'.$task->getID().'" class="task">
                          <input class="task-checkbox" type="checkbox"';
                            echo ($task->getStatus() != 0) ? 'checked' : '';
                          echo '></input>
                          <p class="task-name">
                            '.$task->getName().'
                          </p>

                          <p class="task-delete">
                            X
                          </p>
                        </div>
                        ';
                      }
                    }
                  echo '</div>
                  <p class="add-new-task">Add new task</p>
                </div>

                ';
              }
            }
          ?>
        </div>
        <p id="add-new-project" class="add-new-project">Add new project</p>
    </div>
  </body>
  <script src="js/ajax.js"></script>
  <script src="js/projects.js"></script>
  <script src="js/projects_secondary.js"></script>
</html>
