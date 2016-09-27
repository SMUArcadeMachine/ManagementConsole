<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: claylewis
 */

class Rom extends REST_Controller
{
    public function active_roms_get(){
        q('BEGIN');
        $this->load->model('rom_model');
        $roms = $this->rom_model->get_active_roms();
        q('COMMIT');

        $this->response($roms,200);
    }

    public function inactive_roms_get(){
        q('BEGIN');
        $this->load->model('rom_model');
        $roms = $this->rom_model->get_inactive_roms();
        q('COMMIT');

        $this->response($roms,200);
    }

    public function activate_rom_put(){
        $gid = $this->put('gid');

        q('BEGIN');
        $this->load->model('rom_model');
        $this->rom_model->activate_rom($gid);
        q('COMMIT');

        $this->response(null,200);
    }

    public function deactivate_rom_put(){
        $gid = $this->put('gid');

        q('BEGIN');
        $this->load->model('rom_model');
        $this->rom_model->deactivate_rom($gid);
        q('COMMIT');

        $this->response(null,200);
    }

}