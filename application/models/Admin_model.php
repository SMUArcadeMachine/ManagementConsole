<?php

class Admin_model extends CI_Model {
    function __construct() {
        require_once __DIR__ . '/../resources/password/password.php';
    }

    function load_users(){
        $sql = $this->db->from('users')->where(['type' => 2])->get_compiled_select();

        $users = q(array(
            'sql' => $sql
        ));

        return [
            'users' => !empty($users) ? $users : []
        ];
    }

    function delete_users($users){
        foreach($users as $user){
            $this->db->delete('users',array(
                'uid' => $user['id']
            ));
        }
    }

    function create_users($emails){
        $added_users = [];
        foreach($emails as $email){
            if(lookup_user($email, 'User lookup failed.',false)){
                throw new Exception('There is already a user in the system with email ' . $email . '.');
            }
            $user_info = $this->_create_user_info($email);
            $user = $this->_insert_user($user_info);

            //Send user an account creation email
            $this->queue->notification('account_created',array(
                'url' => BASE_URL . "register",
            ),$user);

            $added_users[] = $user;
        }
        return [
            'users' => $added_users
        ];
    }
    private function _create_user_info($email){
        valid_username($email);

        //Parse user info
        return array(
            'username' => $email,
            'password' => null
        );

    }
    private function _insert_user($user_info){
        $date = date('Y-m-d H:i:s');
        $data = array(
            //Required
            'username' => $user_info['username'],

            //Optional
            'profile_picture_url' => get_gravatar($user_info['username'],80,'identicon'),

            //Defaults
            'type' => '2' ,
            'date_banned_till' => $date ,
            'ip' => $_SERVER[IP_HEADER] ,
            'date_start' => $date,
            'active' => 0
        );

        if(!$this->db->insert('users',$data)) throw new Exception('Error creating user.');

        $data['id'] = $data['uid'] = $this->db->insert_id();
        return $data;
    }
}
