<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Roms extends REST_Controller {
    public function __construct(){
        parent::__construct();
    }
    public function index_get(){
        $this->load->model('roms_model');
        $return_data = $this->roms_model->load();
        $this->response($return_data,200);
    }
    public function index_put(){
        $rom = $this->put('rom')?:array();
        if(empty($rom)) throw new Exception('ROM parameters empty.');

        $rom['id'] = $this->uri->segment(2);

        q('BEGIN');
        $this->load->model('roms_model');
        $return_data = $this->roms_model->update($rom);
        q('COMMIT');
        $this->response($return_data,200);
    }
}

