<?php

class Register_model extends CI_Model {
    function is_valid_registration($user){
        //Check if valid keys
        $empty_keys = array();
        $required_keys = array('username','username2','password','password2');
        foreach($required_keys as &$key){
            if(empty($user[$key])) $empty_keys[] = $key;
        }
        if(!empty($empty_keys)) throw new Exception('Keys missing or empty: ' . implode(', ',$empty_keys));

        //Check registration run through
        valid_username($user['username']);

        //Password check
        if($user['password'] != $user['password2'] ) throw new Data_error(array('error' => 'Password miss match.','type' => 'password'));

        //Username Check
        if($user['username'] != $user['username2']){
            throw new Data_error(array('error' => 'Username miss match.','type' => 'email'));
        }
    }
}
