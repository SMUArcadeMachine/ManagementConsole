<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Cron extends CI_Controller {

    public function test(){
    }
    public function do_something(){
        if($this->input->is_cli_request() || ENVIRONMENT == 'development'){
            try{
                q('BEGIN');
                //Do something here
                q('COMMIT');
                echo 'do_something' . "\n";
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



