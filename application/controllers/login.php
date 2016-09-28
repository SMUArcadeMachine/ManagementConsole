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

            $this->load->model('users_model');

            $message = $this->users_model->load($uid,FALSE);

            $return_data = array(
                'status' => 'success',
                'ac' => $api_key,
                'message' => $message,
                'uid' => $uid
            );

        }else{
            $username = $this->post('username');
            $password = $this->post('password');

            $return_data = $this->login_model->check_login($username,array('password' => $password));
        }
        q('COMMIT');
        $this->response($return_data,200);
    }

}

