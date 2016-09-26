<?php
class Data_error extends Exception{

    public function __construct($data=null){
        $this->data = $data;
    }

    public function getData(){
        return $this->data;
    }

}
class Log_Error extends Exception{

    public function __construct($data=null){
        $this->data = $data;
    }

    public function getData(){
        return $this->data;
    }

}