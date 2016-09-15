<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Cron extends CI_Controller {

    public function test(){
    }
    public function update_expired_listings(){
        if($this->input->is_cli_request() || ENVIRONMENT == 'development'){
            try{
                q('BEGIN');
//                $this->load->model('cron_model');
//                $this->cron_model->update_expired_listings();
                q('COMMIT');
                echo 'update_expired_listings' . "\n";
            }catch(Exception $e){
                q('ROLLBACK');
                backend_log(array(
                    'error' => $e->getMessage()
                ),$e);
            }
        }else{
            show_404();
        }
    }
}



