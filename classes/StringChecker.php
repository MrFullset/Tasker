<?php

/**
This class describes regexp based string checker to improve steadiness to
attacks such as XSS or SQL Injection. Also can check if string format
is correct (for logins, passwords etc). Exists a special list of forbidden
symbols: \ " ; ( )  . Every string with such symbols will be marked as
bad formatted. Basic functionality can be used with static method Check(),
as arguments should be given TYPE and STRING.


Types:
  'login'     - login format 1-30 symbols
  'pass'      - password format 6-30 symbols, at least 1 capital and 1 number
  'innerHTML' - text format for fields (project names, task names etc)
  'id'        - ids fromat numeric, not negative


*/

  class StringChecker
  {
    function __construct()
    {}

    public function SCheck($type, $string){
      switch ($type) {
        case 'login':
        case 'pass':
        case 'innerHTML':
        case 'id':
          return $this->$type($string);
          break;
        default:
          return -1;
      }
    }

    public static function Check($type, $string){
      switch ($type) {
        case 'login':
        case 'pass':
        case 'innerHTML':
        case 'id':
          return (new StringChecker(NULL))->$type($string);
          break;
        default:
          return -1;
      }
    }

    private function login($string){
      preg_match('/^[^\'\";()]{1,30}$/', $string, $matches, PREG_OFFSET_CAPTURE);
      if(count($matches))
        return true;
      return false;
    }

    private function pass($string){
      preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d][^\'\";()]{6,30}$/', $string, $matches, PREG_OFFSET_CAPTURE);
      if(count($matches))
        return true;
      return false;
    }

    private function innerHTML($string){
      preg_match('/^[^\'\";()<>]{1,30}$/', $string, $matches, PREG_OFFSET_CAPTURE);
      if(count($matches))
        return true;
      return false;
    }

    private function id($string){
      preg_match('/^[1-9]+$/', $string, $matches, PREG_OFFSET_CAPTURE);
      if(count($matches))
        return true;
      return false;
    }

  }



?>
