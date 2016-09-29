<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Accounts extends REST_Controller {
    public function index_get(){
        $uid = $this->uid();
        if(empty($uid)) throw new Exception('UID empty.');

        $this->load->model('accounts_model');
        $return_data = $this->accounts_model->load($uid,FALSE);
        $this->response($return_data,200);
    }
    public function index_put(){
        $account = $this->put('account')?:array();
        $uid = $this->uid();
        $email = $this->email();
        if(empty($account)) throw new Exception('Account parameters empty.');

        q('BEGIN');
        $this->load->model('accounts_model');
        $return_data = $this->accounts_model->update($uid,$account,$email);
        q('COMMIT');
        $this->response($return_data,$return_data ? 200 : 204);
    }
}

