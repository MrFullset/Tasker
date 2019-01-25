<?php

class Project{
  private $ID;
  private $Tasks;
  private $Name;
  private $user_id;
  private $mysql;

  public function getID(){return $this->ID;}
  public function getTasks(){return $this->Tasks;}
  public function getName(){return $this->Name;}
  public function getUserID(){return $this->user_id;}

  public function __construct($id){
    if($id == NULL)
      return;
    $this->ID = $id;
    $this->mysql = new MySQLProvider();
    $this->mysql->Connect();
    $response = $this->mysql->MakeRequest("SELECT * FROM `projects` WHERE `id` LIKE '".$id."'");
    $this->Name = $response[0]['name'];
    $this->user_id = $response[0]['user_id'];
    $this->Tasks = Array();
    $response = $this->mysql->MakeRequest("SELECT `id` FROM `tasks` WHERE `project_id` LIKE '".$id."'");
    $this->mysql->Disconnect();
    if($response)
      foreach ($response as $task)
        $this->Tasks[] = new Task($task['id']);
  }

  public function Delete(){
    $this->mysql->Connect();
    $this->mysql->MakeQuery("DELETE FROM `projects` WHERE `id`=".$this->ID."");
    $this->ID = -1;
    $this->Name = NULL;
    $this->user_id = NULL;
    $this->mysql->Disconnect();
  }

  public function UpdateName($newName){
    $this->mysql->Connect();
    $this->mysql->MakeQuery("UPDATE `projects` SET `name`='".$newName."' WHERE `id`=".$this->ID."");
    $this->mysql->Disconnect();
    $this->Name = $newName;
  }

  public static function Create($name, $user_id){
    $mysql = new MySQLProvider();
    $mysql->Connect();
    $mysql->MakeQuery("INSERT INTO `projects` (`name`, `user_id`) VALUES ('".$name."', '".$user_id."')");
    $ids = $mysql->MakeRequest("SELECT * FROM `projects` WHERE `user_id` LIKE '".$user_id."'");
    $newId = end($ids)['id'];
    $mysql->Disconnect();

    return (new Project($newId));
  }



}

?>
