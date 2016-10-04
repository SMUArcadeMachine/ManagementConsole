<?php

class Users_model extends CI_Model {

    function load($uid){
        $user = lookup_user($uid);
        if(!$user) throw new Exception('Error retrieving account info.');

        $return_data = array(
            'id' => $user['uid'],
            'type' => $user['type'],
            'username' => $user['username'],
            'date_start' => $user['date_start'],
            'profile_picture_url' => $user['profile_picture_url'],
        );

        return array_merge(
            array(
                'users' => array($return_data),
            )
        );
    }

    function update($uid,$old_user){
        $keys = array_keys($old_user);
        $new_account = array();
        if(!empty($keys)){
            foreach($keys as $key){
                switch($key){
                    case 'password':
                        $response = $this->_parse_new_pasword($old_user['password']);
                        $new_account = array_merge($new_account,$response);
                        break;
                }
            }
        }

        //Update account
        if(!empty($new_account)){
            $response = $this->db->update('users', $new_account, array('uid' => $uid));
            if(!$response) throw new Exception('Update account failed');
        }

        //Format for response
        return $this->load($uid);
    }
    private function _parse_new_pasword($new_password){
        require_once __DIR__ . '/../resources/password/password.php';
        return array('password' => password_hash($new_password, PASSWORD_DEFAULT));
    }
}
