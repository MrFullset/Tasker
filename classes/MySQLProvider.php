<?php

class MySQLProvider{
  private $user;
  private $password;
  private $resource;
  private $status;
  private $link;

  public function __construct(){
    $this->user = 'mrfullset';
    $this->password = '123456';
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
