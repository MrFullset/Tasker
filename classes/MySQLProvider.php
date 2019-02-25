<?php


/**
This class is an interface for manipulating data in
database of project. Data of database user is encapsulated and sets itself by
default in constructor.

Methods:
  Connect() - Connect do database
  Disconnect() - Disconnect from database
  MakeRequest($request) - Make request to DB. Takes as argument request string
    formatted as SQL request. Returns fetched array of data. If no data returns NULL
  MakeQuery($request) - Make request to DB which doesn't return any data

Variables:
private:
  user - user of database (should have rights to edit tables `user`, `projects` and `tasks`)
  password - password of user
  resource - IP or domain where database is located
  link - instance of MySQLi with which operations are providing
**/

class MySQLProvider{
  private $user;
  private $password;
  private $resource;
  private $link;

  public function __construct(){
    $this->user = 'login';
    $this->password = 'password';
    $this->resource = '127.0.0.1';
  }

  public function Connect(){
    $this->link = mysqli_connect($this->resource, $this->user, $this->password, 'tasker');
  }

  public function MakeRequest($request)
  {
    if(!$this->link){
      return NULL;
    }
    $result = Array();
    $response = mysqli_query($this->link, $request);
    //fetches response to easily accesable array
    while($row = mysqli_fetch_assoc($response)){
      $result[] = $row;
    }
    if(count($result) == 0)
      return NULL;
    return $result;
  }

  public function MakeQuery($request){
    if(!$this->link){
      return NULL;
    }
    mysqli_query($this->link, $request);

  }

  public function Disconnect(){
    if(!$this->link)
      return NULL;

    mysqli_close($this->link);
  }


}


?>
