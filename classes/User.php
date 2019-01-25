<?php

class User{
  private $id;
  private $login;
  private $password;
  private $status;
  private $data;

  public function getID(){return $this->id;}
  public function getLogin(){return $this->login;}
  public function getSavedData(){return $this->data;}

  public function __construct($try_login, $try_password){
    $this->id = -1;
    $this->status = 0;
    $this->login = $try_login;
    $this->password = md5('eyutyeoiuwytroptyweoirtupeoiryu'.md5($try_password));
  }

  public function Auth(){
    $mysql = new MySQLProvider();
    $mysql->Connect();
    $response = $mysql->MakeRequest("SELECT * FROM `users` WHERE `login` LIKE '".$this->login."'");
    if(!isset($response[0]['id'])){
      $this->status = -1;
      return -1;
    }
    if($this->password == $response[0]['password']){
      $this->id = $response[0]['id'];
      $this->status = 1;
    }
    else{
      $this->status = -2;
    }

    return $this->status;
    $mysql->Disconnect();

  }

  public function GetData(){
    $i = 0;
    $this->data = Array();
    $link = new MySQLProvider();
    $link->Connect();
    $response_projects = $link->MakeRequest("SELECT `id` FROM `projects` WHERE `user_id` LIKE '".$this->id."'");
    if(count($response_projects) != 0)
      foreach ($response_projects as $project) {
        $this->data[] = new Project($project['id']);
      }
    $link->Disconnect();

    return $this->data;
  }

  public static function Register($login, $password){
    $password_hashed = md5('eyutyeoiuwytroptyweoirtupeoiryu'.md5($password));
    $link = new MySQLProvider();
    $link->Connect();
    $response = $link->MakeRequest("SELECT `id` FROM `users` WHERE `login` LIKE '".$login."'");
    if(count($response) != 0)
        return NULL;
    $link->MakeQuery("INSERT INTO `users` (`login`, `password`) VALUES ('".$login."', '".$password_hashed."')");
    $response = $link->MakeRequest("SELECT `id` FROM `users` WHERE `login` LIKE '".$login."'");
    $response = end($response);
    $link->Disconnect();

    return (new User($login, $password));
  }

}
?>
