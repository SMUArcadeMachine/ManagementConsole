<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends REST_Controller {
    public function __construct(){
        parent::__construct();
        $this->load->model('admin_model', '', TRUE);
        $this->_check_is_admin();
    }
    private function _check_is_admin(){
        $user = lookup_user($this->uid());
        if($user['type'] != '1'){
            throw new Exception('You are not an admin user.');
        }
    }
    public function users_post(){
        $emails = $this->post('emails');
        if(empty($emails)) throw new Exception('Emails empty');

        q('BEGIN');
        $return_data = $this->admin_model->create_users($emails);
        q('COMMIT');
        $this->response($return_data,200);
    }
    public function users_delete(){
        $users = $this->delete('users');
        if(empty($users)) throw new Exception('Users empty');

        q('BEGIN');
        $this->admin_model->delete_users($users);
        q('COMMIT');
        $this->response(null,204);
    }
    public function users_get(){
        $return_data = $this->admin_model->load_users();
        $this->response($return_data,200);
    }
    public function reboot_post(){
//        sleep(5);
        shell_exec("sudo sh /var/www/html/documentation/scripts/rbt.sh");
        $this->response(null,204);
    }
}

