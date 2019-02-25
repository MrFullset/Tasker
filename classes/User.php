<?php

/**
This class describes User. While creating new instance set all variables and
prepare instance to authentication(salts password).

Getters:
  getLogin() - returns login of user
  getID() - returns ID of user
  getSavedData() - returns downloaded data (Projects, Tasks)

Static methods:
  Register($login, $password) - registers new user. Takes as arguments login string
    and raw (unsalted, not hashed) password. Returns new User instance. If user
    with this login exists or data isn't formatted correctly returns NULL.

Methods:
  public:
    Auth() - Authenticate user. Compares data with existing in DB. Sets Status
      variable to 1 in success, -1 if login isn't correct, -2 if password isn't
      correct, -3 if login or password aren't correctly formatted.
    GetData() - Requests DB for user's data as Projects and Tasks.


**/

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
    //salting password
    $this->password = md5('eyutyeoiuwytroptyweoirtupeoiryu'.md5($try_password));
  }

  public function Auth(){
    $mysql = new MySQLProvider();
    $mysql->Connect();
    $response = $mysql->MakeRequest("SELECT * FROM `users` WHERE `login` LIKE '".$this->login."'");
    //check if login exists
    if(!isset($response[0]['id'])){
      $this->status = -1;
      return -1;
    }
    //check if password id correct
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
    //get project's IDs of this user
    $response_projects = $link->MakeRequest("SELECT `id` FROM `projects` WHERE `user_id` LIKE '".$this->id."'");
    if(count($response_projects) != 0)
      foreach ($response_projects as $project) {
        $this->data[] = new Project($project['id']);
      }
    $link->Disconnect();

    return $this->data;
  }

  public static function Register($login, $password){
    //salting password
    $password_hashed = md5('eyutyeoiuwytroptyweoirtupeoiryu'.md5($password));
    $link = new MySQLProvider();
    $link->Connect();
    //check is user with such login exists
    $response = $link->MakeRequest("SELECT `id` FROM `users` WHERE `login` LIKE '".$login."'");
    //if exists
    if(count($response) != 0)
        return NULL;
    $link->MakeQuery("INSERT INTO `users` (`login`, `password`) VALUES ('".$login."', '".$password_hashed."')");
    //set new user ID to instance
    $response = $link->MakeRequest("SELECT `id` FROM `users` WHERE `login` LIKE '".$login."'");
    $response = end($response);
    $link->Disconnect();

    return (new User($login, $password));
  }

}
?>
