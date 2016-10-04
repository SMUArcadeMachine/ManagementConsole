<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends REST_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->model('login_model', '', TRUE);
    }
    public function index_post(){
        $user = $this->post('user');
        if(empty($user)) throw new Exception('User empty');

        //Checks registration and form user info
        $user_info = $this->login_model->create_user_info($user);

        q('BEGIN');
        $return_data = $this->login_model->create_user($user_info);
        q('COMMIT');
        $this->response($return_data,200);
    }
    public function index_get(){
        $uid = $this->rest->user_id;
        if(empty($uid)) throw new Exception('UID empty.');

        $this->load->model('users_model');
        $return_data = $this->users_model->load($uid,FALSE);
        $this->response($return_data,200);
    }
    public function index_put(){
        $user = $this->put('user')?:array();
        $uid = $this->uid();
        if(empty($user)) throw new Exception('User parameters empty.');
        q('BEGIN');
        $this->load->model('users_model');
        $return_data = $this->users_model->update($uid,$user);
        q('COMMIT');
        $this->response($return_data,$return_data ? 200 : 204);
    }
}

