<?php

class Register_model extends CI_Model {

    function is_valid_registration($user){
        //Check if valid keys
        $empty_keys = array();
        $required_keys = array('email1','email2','password1','password2');
        foreach($required_keys as &$key){
            if(empty($user[$key])) $empty_keys[] = $key;
        }
        if(!empty($empty_keys)) throw new Exception('Keys missing or empty:' . implode(', ',$empty_keys));
        //Check registration run through
        $this->check_registration($user);
    }
    function check_registration($user,$oauth = false){
        $email_key = $oauth ? 'email' : 'email1';

        valid_email($user[$email_key]);

        //Password check
        if(!$oauth && $user['password1'] != $user['password2'] ) throw new Data_error(array('error' => 'Password miss match.','type' => 'password'));

        //Email Check
        if(!$oauth && ($user['email1'] != $user['email2'])){
            throw new Data_error(array('error' => 'Email miss match.','type' => 'email'));
        }
    }




}
