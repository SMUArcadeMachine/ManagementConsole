<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Library{
    var $ci = null;
    var $data = null;
    function __construct(){
        $this->ci = &get_instance();
    }
}