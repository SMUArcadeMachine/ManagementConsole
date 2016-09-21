<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends REST_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->model('login_model', '', TRUE);
    }
    public function index_post(){
        q('BEGIN');
        $api_key = $this->api_key();
        if($api_key != null){
            $uid = $this->uid();
            $this->_allow = $this->_detect_api_key();
            if($this->_allow === FALSE) throw new Exception('Invalid API Key.');

            $this->load->model('accounts_model');

            $message = $this->accounts_model->load($uid,FALSE);

            $return_data = array(
                'status' => 'success',
                'api_key' => $api_key,
                'message' => $message,
                'uid' => $uid
            );

        }else{
            $email = $this->post('email');
            $password = $this->post('password');

            $return_data = $this->login_model->check_login($email,array('password' => $password));
        }
        q('COMMIT');
        $this->response($return_data,200);
    }
    public function create_post(){
        $user = $this->post('user');
        if(empty($user)) throw new Exception('User empty');

        //Checks registration and form user info
        $user_info = $this->login_model->create_user_info($user);

        q('BEGIN');
        $return_data = $this->login_model->create_user($user_info);
        q('COMMIT');
        $this->response($return_data,200);
    }

}

