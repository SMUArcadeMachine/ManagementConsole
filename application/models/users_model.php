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

    function update($uid,$account){
        $keys = array_keys($account);
        $new_account = $return_data = array();
        $user = lookup_user($uid);
        if(!empty($keys)){
            foreach($keys as $key){
                switch($key){
                    case 'email':
                        $response = $this->_check_email($account[$key]);
                        $new_account = array_merge($new_account,$response);
                        break;
                    case 'password':
                        $response = $this->_check_password($account[$key],$user);
                        $new_account = array_merge($new_account,$response);
                        break;
                    case 'first_name':
                    case 'last_name':
                        $new_account[$key] = $account[$key];
                        break;
                }
            }
        }

        //Update account
        if(!empty($new_account)){
            $response = $this->db->update('users', $new_account, array('uid' => $uid));
            if(!$response) throw new Exception('Update account failed');
        }

        //Get new account
        $updated_account = $this->load($uid);

        //Format for response
        return array_merge($return_data,$updated_account);
    }
    private function _check_password($hash,$user){
        require_once __DIR__ . '/../resources/password/password.php';
        $old_pass = $hash['old'];
        $new_pass = $hash['new'];

        $password_verify = password_verify($old_pass, $user['password']);

        if($user && $password_verify){
            return array('password' => password_hash($new_pass, PASSWORD_DEFAULT));
        }else{
            throw new Exception('Old password invalid');
        }
    }
    private function _check_email($email){
        valid_email($email);
        return array(
            'email' => $email,
        );
    }
}
