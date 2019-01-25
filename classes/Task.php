<?php

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
    $this->mysql = new MySQLProvider();
    $this->mysql->Connect();
    $response = $this->mysql->MakeRequest("SELECT * FROM `tasks` WHERE `id` LIKE '".$id."'");
    $this->ID = $id;
    $this->Name = $response[0]['name'];
    $this->Status = $response[0]['status'];
    $this->ProjectID = $response[0]['project_id'];
    $this->user_id = $this->mysql->MakeRequest("SELECT `user_id` FROM `projects` WHERE `id` LIKE '".$this->ProjectID."'")[0]['user_id'];
    $this->mysql->Disconnect();
  }

  public function ChangeState(){
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
    $ids = $mysql->MakeRequest("SELECT * FROM `tasks` WHERE `project_id` LIKE '".$project_id."'");
    $newId = end($ids)['id'];
    $mysql->Disconnect();

    return (new Task($newId));
  }

}


?>
