<?php
/**
This class describes Task. While creating new instance automatically
download all data of current task only if has as an argument correct ID. If there
isn't makes empty instance

Getters:
  getID() - returns ID of task
  getName() - returns name of task
  getStatus() - returns status of task (0 - undone, 1 - done)
  getProjectID() - returns project ID in which was created this task
  getUserID() - returns user ID which created this task

Static methods:
  Create($name, $project_id) - Creates a new task. Gets as arguments name of
  task and project ID in which is creating this task. Sends data to DB,
  sets all variables. Returns instance of created project.

Methods:
  ChangeState() - Updates task state. Sets to opposite. Send data to DB, sets
    Status variable
  UpdateName($newName) - Updates task name. Takes as an argument
    new name string. Makes request to DB, updates Name variable
  Delete() - Deletes task. Makes request to DB, empty variables of instance

Variables:
  private:
    ID
    Name
    Status
    ProjectID
    mysql
    user_id
**/


class Task{

  private $ID;
  private $Name;
  private $Status;
  private $ProjectID;
  private $mysql;
  private $user_id;

  public function getID(){return $this->ID;}
  public function getName(){return $this->Name;}
  public function getStatus(){return $this->Status;}
  public function getProjectID(){return $this->ProjectID;}
  public function getUserID(){return $this->user_id;}

  public function __construct($id){
    if($id == NULL)
      return;
    $this->mysql = new MySQLProvider();
    $this->mysql->Connect();
    //get data of task from DB
    $response = $this->mysql->MakeRequest("SELECT * FROM `tasks` WHERE `id` LIKE '".$id."'");
    $this->ID = $id;
    $this->Name = $response[0]['name'];
    $this->Status = $response[0]['status'];
    $this->ProjectID = $response[0]['project_id'];
    //get user ID
    $this->user_id = $this->mysql->MakeRequest("SELECT `user_id` FROM `projects` WHERE `id` LIKE '".$this->ProjectID."'")[0]['user_id'];
    $this->mysql->Disconnect();
  }

  public function ChangeState(){
    //change status to the opposite one
    $this->Status = ($this->Status == 0) ? 1 : 0;
    $this->mysql->Connect();
    $this->mysql->MakeQuery("UPDATE `tasks` SET `status`='".$this->Status."' WHERE `id`='".$this->ID."'");
    $this->mysql->Disconnect();
  }

  public function Delete(){
    $this->mysql->Connect();
    $this->mysql->MakeQuery("DELETE FROM `tasks` WHERE `id`=".$this->ID."");
    $this->mysql->Disconnect();
    $this->ID = -1;
    $this->Name = NULL;
    $this->Status = NULL;
    $this->ProjectID = NULL;
  }

  public function UpdateName($newName){
    $this->mysql->Connect();
    $this->mysql->MakeQuery("UPDATE `tasks` SET `name`='".$newName."' WHERE `id`='".$this->ID."'");
    $this->mysql->Disconnect();
    $this->Name = $newName;
  }

  public static function Create($name, $project_id){
    $mysql = new MySQLProvider();
    $mysql->Connect();
    $mysql->MakeQuery("INSERT INTO `tasks` (`name`, `project_id`, `status`) VALUES ('".$name."', '".$project_id."', '0')");
    //setting new id of task
    $ids = $mysql->MakeRequest("SELECT * FROM `tasks` WHERE `project_id` LIKE '".$project_id."'");
    $newId = end($ids)['id'];
    $mysql->Disconnect();

    return (new Task($newId));
  }

}


?>
