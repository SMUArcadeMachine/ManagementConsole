<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Reboot extends REST_Controller {

    public function index_post(){
//        sleep(5);
        shell_exec("sudo sh /var/www/html/documentation/scripts/rbt.sh");
        $this->response(null,204);
    }

}



