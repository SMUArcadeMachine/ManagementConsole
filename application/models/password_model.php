<?php
class Password_model extends CI_Model {
    function create_password_reset($username){
        $sql = $this->db->from('users')->where(array('username' => $username))->get_compiled_select();
        $user = q(array(
            'sql' => $sql,
            'flat' => true
        ));
        if(!$user) throw new Exception('There are no accounts with that username on ' . BASE_NAME);
        $reset_token = uniq_hash();
        $data = array(
            'token' => $reset_token,
            'uid' => $user['uid']
        );
        $this->db->insert('password_resets', $data);

        $this->queue->notification('password_reset',array(
            'url' => BASE_URL . "forgot/password/reset?t=" . $reset_token
        ),$user);
        return true;
    }
    function confirm_password_reset($token,$password){
        require_once __DIR__ . '/../resources/password/password.php';
        if(empty($token)){
            throw new Exception('Password reset token is empty.');
        }else if(empty($password)){
            throw new Exception('New password is empty.');
        }else {
            $data = array(
                'token' => $token
            );
            $sql = $this->db->from('password_resets')->where($data)->get_compiled_select();
            $password_reset = q(array(
                'sql' => $sql,
                'flat' => true
            ));
            if(time() - strtotime($password_reset['date_created']) < 60*60*24 && $password_reset){
                //Lookup user
                $user = lookup_user($password_reset['uid']);

                //Update password
                $data = array(
                    'password' => password_hash($password, PASSWORD_DEFAULT)
                );
                update_user($data,$user['uid']);

                //Reset reset password token
                $this->db->delete('password_resets', array('id' => $password_reset['id']));
                return true;
            }else if(!$password_reset){
                throw new Exception('Invalid password reset token.');
            }else if(time() - strtotime($password_reset['date_created']) > 60*60*24){
                throw new Exception('Password reset request expired.');
            }else{
                throw new Exception('Error resetting password.');
            }

        }
    }
}
