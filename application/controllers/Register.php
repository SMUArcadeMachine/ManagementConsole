<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Register extends REST_Controller {
    public function index_get(){
        $email = $this->get('email');
        if(empty($email)) throw new Exception('Email is blank.');

        q('BEGIN');
        $this->load->model('register_model');
        valid_email($email);
        q('COMMIT');
        $this->response(null,204);
    }
}

