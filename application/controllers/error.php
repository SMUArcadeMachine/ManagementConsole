<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Error extends REST_Controller {

    public function index_post(){
        backend_log(array(
            'uid' => $this->uid() ?: 'No UID',
            'stack' => $this->post('stack') ?: 'No Stack'
        ));
    }
}

