<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Password extends REST_Controller {
    public function reset_post(){
        $username = $this->post('username');

        q('BEGIN');
        $this->load->model('password_model');
        $this->password_model->create_password_reset($username);
        q('COMMIT');
        $this->response(null,204);
    }
    public function reset_put(){
        $token = $this->put('token');
        $password = $this->put('password');

        q('BEGIN');
        $this->load->model('password_model');
        $this->password_model->confirm_password_reset($token,$password);
        q('COMMIT');
        $this->response(null,204);
    }
}

