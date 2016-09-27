<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Logout extends REST_Controller {
    public function index_delete(){
        $api_key = $this->api_key();
        $api_key_exploded = explode('_',$api_key);
        $uid = $api_key_exploded[0];

        q('BEGIN');
        $this->load->model('login_model', '', TRUE);
        $this->login_model->logout($uid);
        q('COMMIT');
        $this->response(null,204);
    }
}

