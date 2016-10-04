<?php

class Login_model extends CI_Model {
    function __construct() {
        require_once __DIR__ . '/../resources/password/password.php';
        $this->load->model('users_model');
    }
    /* ------------------------Regular Login Check---------------------------*/
    function check_login($username,$password){

        //Username lookup
        $user = lookup_user($username,'Username or password incorrect.');

        if(empty($user['active'])){
            throw new Exception('This user has been created but the password has not been set. Register with the email ' . $user['username'] . ' and set your password.');
        }

        //Check password
        $password_verify = password_verify($password, $user['password']);

        //Check failed logins
        $failed_history = $this->_check_failed_logins($user);

        if($user && $password_verify){
            return $this->_finalize_login($user,$failed_history);
        }else{
            $failed_history = $this->_add_failed_login($failed_history,$user);

            throw new Exception($failed_history['message']);
        }
    }

    /* ------------------------Final login check-----------------------*/
    function _finalize_login($user,$failed_history = null){
        try{
            //Check failed logins
            $failed_history = $this->_check_failed_logins($user,$failed_history);

            if($user){

                //Log user login history
                $data = array(
                    'uid' => $user['uid'] ,
                    'ip' => $_SERVER[IP_HEADER]
                );
                $this->db->insert('user_login_history',$data);
                $this->_delete_failed_logins($failed_history);

                //Load account details
                $this->load->model('users_model');

                $return_data = array(
                    'access_token' => $this->_create_api_key($user),
                    'uid' => $user['uid'],
                );

                //Return data with newly created API key
                return $return_data;
            }else{
                throw new Exception('Error looking up user.');
            }

        }catch(Exception $e){
            throw $e;
        }
    }
    private function _check_failed_logins($user,$failed_history = null){
        //Don't double check
        if($failed_history != null) return $failed_history;

        $failed_history = lookup_failed_logins($user['uid']);
        if(is_array($failed_history)){
            if($failed_history['attempts'] >= (FAILED_LOGIN_ATTEMPTS - 1) && (time() - strtotime($failed_history['last_attempt_date']) < 60*60*24)){
                $message = 'This account has been locked for 24 hours due to ' . FAILED_LOGIN_ATTEMPTS . ' failed login attempts. Please contact support for more help.';
                if($failed_history['attempts'] == FAILED_LOGIN_ATTEMPTS - 1){
                    $failed_history['message'] = $message;
                }else{
                    throw new Exception($message);
                }
            }
            return $failed_history;
        }else{
            return true;
        }
    }
    private function _add_failed_login($failed_history,$user){
        //Failed login - record failed login history
        if(is_array($failed_history)){
            $failed_history = array_merge($failed_history,array('attempts' => $failed_history['attempts'] + 1));
            $this->queue->force_fn(
                'update',
                array(
                    'user_failed_login_history',
                    array('attempts' => $failed_history['attempts']),
                    array('id' => $failed_history['id'])
                ),
                $this->db
            );
        }else{
            $failed_history = array(
                'attempts' => 1,
                'ip' => $_SERVER[IP_HEADER],
                'uid' => $user['uid']
            );
            $this->queue->force_fn(
                'insert',
                array(
                    'user_failed_login_history',
                    $failed_history
                ),
                $this->db
            );
        }

        if(empty($failed_history['message'])){
            if(FAILED_LOGIN_ATTEMPTS - $failed_history['attempts'] <= 2){
                $failed_history['message'] = 'Username or password incorrect. You will be locked for 24 hours in ' . (FAILED_LOGIN_ATTEMPTS - $failed_history['attempts']) . ' more attempts.';
            }else{
                $failed_history['message'] = 'Username or password incorrect.';
            }
        }

        return $failed_history;
    }
    private function _delete_failed_logins($failed_history){
        //Successful login - clear failed login history
        if(is_array($failed_history)){
            $this->db->delete('user_failed_login_history',array('uid' => $failed_history['uid']));
        }
    }

    /* ------------------------Logout----------------------------------*/
    function logout($uid){
        if($this->db->update('api_keys',array('active' => 0),array('uid' => $uid))){
            $this->_reset_session();

            return true;
        }else{
            throw new Exception('Error deleting login key.');
        }
    }
    private function _reset_session(){
        session_start();
        session_unset();
        session_destroy();
    }


    /* ------------------------Creating User from admin created user---------------------------*/
    function create_user($user_info){
        $user = lookup_user($user_info['username']);
        if(!empty($user) && empty($user['active'])){
            return $this->_update_user(array_merge($user,$user_info));
        }else{
            throw new Exception('Please ask an IG staff member in the IG at SMU to register as a Management Console user.');
        }
    }
    function create_user_info($user){
        //Check if valid registration one last time
        $this->load->model('register_model', '', TRUE);
        $this->register_model->is_valid_registration($user);

        //Parse user info
        return array(
            'username' => $user['username'],
            'password' => $user['password']
        );

    }
    private function _update_user($user){
        $password = !empty($user['password']) ? password_hash($user['password'], PASSWORD_DEFAULT) : null;

        $update_data = [
            'password' => $password,
            'active' => 1
        ];
        update_user($update_data,$user['uid']);

        return array(
            'user' => array_merge($user,$update_data)
        );
    }

    /* ------------------------Helpers----------------------------------*/
    function _create_api_key($user){
        $uniq_token = $user['uid'] . '_' . uniq_hash();
        $uniq_token_hashed = password_hash($uniq_token,PASSWORD_DEFAULT);
        $user['uid'] = intval($user['uid']);
        $data = array(
            'active' => 1 ,
            'uid' => $user['uid'] ,
            'username' => $user['username'] ,
            'api_key' => $uniq_token_hashed ,
            'ip_addresses' => $_SERVER[IP_HEADER],
            'level' =>  intval($user['type'])
        );
        $this->db->insert('api_keys', $data);

        return $uniq_token;
    }
}
