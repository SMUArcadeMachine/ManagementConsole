<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends REST_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->model('login_model', '', TRUE);
    }
    public function index_post(){
        q('BEGIN');
        $username = $this->post('username');
        $password = $this->post('password');

        if(empty($username)) throw new Exception('Username is required.');
        if(empty($password)) throw new Exception('Password is required.');

        $return_data = $this->login_model->check_login($username, $password);
        q('COMMIT');
        $this->response($return_data,200);
    }

}

