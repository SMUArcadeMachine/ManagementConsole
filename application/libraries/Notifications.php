<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Notifications {
    var $ci = null;
    var $smarty = null;
    var $directory = '/../resources/EmailTemplates/';
    var $subject_map = array(
        'account_created' => 'Your account has been added',
        'password_reset' => 'Password reset link'
    );
    var $type_column_map = array(
        'account_created' => true,
        'password_reset' => true
    );
    var $type_map = array(
    );
    var $force_notifications = array('password_reset','account_created');
    function __construct(){
        $this->ci =& get_instance();
        require_once __DIR__ . '/../resources/SendGrid/Smarty/libs/Smarty.class.php';
        require_once __DIR__ . '/../resources/SendGrid/sendgrid-php.php';
    }
    function send($types,$params,$users,$subjects = array()){
        if(!NOTIFICATIONS) return $this;

        //Setup
        $this->_setup();

        //Parse users if UID/s supplied
        $users = $this->_format_users($users);

        //Can send notifications?
        $settings = $this->_get_notification_settings($types,$users);

        //Send emails
        $this->_send_emails($types,$params,$users,$settings,$subjects);

        return $this;
    }
    private function _get_subject($type,$params = null){
        $id_appendix = '';
        return $this->subject_map[$type] . $id_appendix;
    }
    private function _get_notification_settings($types,$users){

        $uids = $permissions = array();
        foreach($users as $user){
            $uids[] = $user['uid'];
        }
        if(!empty($uids)){
            $user_count = count($users);
            for($i = 0;$i < $user_count;$i++){
                $column_name = $this->type_column_map[$types[$i]];

                //Force all notifications on
                if(in_array($types[$i],$this->force_notifications)){
                    $email = true;
                }else{
                    //Email
                    if($users[$i]['email_global'] == 0){
                        $email = false;
                    }else if($column_name === false || $column_name === true){
                        $email = $column_name;
                    }else{
                        $email = $users[$i]['email_' . $column_name] == 1;
                    }
                }
                $permissions[$i] = array(
                    'email' => $email,
                );
            }
        }
        return $permissions;

    }
    private function _format_users($users){
        //Find users missing lookup
        $missing_uids = array();
        $needs_lookup_types = array('integer','string','double');
        foreach($users as &$user){
            $found_user = false;
            if(in_array(gettype($user),$needs_lookup_types)){
                foreach($users as $lookup_user){
                    if(!in_array(gettype($lookup_user),$needs_lookup_types) && $user == $lookup_user['uid']){
                        $user = $lookup_user;
                        $found_user = true;
                        break;
                    }
                }
                if(!$found_user) $missing_uids[] = $user;
            }
        }

        if(!empty($missing_uids)){
            $sql = $this->ci->db->from('users')->where_in('uid',$missing_uids)->order_by("uid", "asc")->get_compiled_select();
            $looked_up_users = q($sql)?:array();

            //Replace missing looked up users
            foreach($users as &$user){
                foreach($looked_up_users as $looked_up_user){
                    if(in_array(gettype($user),$needs_lookup_types)){
                        if($looked_up_user['uid'] == $user){
                            $user = $looked_up_user;
                        }
                    }
                }
            }
        }

        return $users;
    }
    private function _send_emails($types,$params,$users,$settings,$subjects){
        $user_count = count($users);
        //Assign template address to username
        for($i = 0;$i < $user_count;$i++){
            //Checks if enabled
            if($settings[$i]['email'] === false) continue;

            //Assign template content
            $this->smarty->assign('template', $types[$i]);

            //Assign username
            $this->smarty->assign('username',ucfirst($users[$i]['username']));

            //Assign all template variables
            foreach($params[$i] as $key => $value)
                $this->smarty->assign($key,$value);

            //Email sending
            $username = $users[$i]['username'];
            $subject = !empty($subjects[$i]) ? $subjects[$i] : $this->_get_subject($types[$i],$params[$i]);
            $subject = '[' . BASE_NAME_ABBR  .'] ' . $subject;
            $content = $this->smarty->fetch('main_template.tpl');

            //Send email
            $mail = new SendGrid\Email();
            $mail->setFrom(SENDGRID_EMAIL)->setFromName(SENDGRID_NAME)->setReplyTo(SENDGRID_REPLY_EMAIL)->addTo($username)->setHtml($content)->setSubject($subject);
            $response = $this->sendGrid->send($mail);
        }
    }
    private function _setup(){
        $this->sendGrid = new SendGrid(SENDGRID_API_KEY);
        $this->smarty = new Smarty;
        $root = __DIR__.'/../resources/EmailTemplates';
        $this->smarty->setTemplateDir($root);
        $this->smarty->setCompileDir($root . '/compile/');
        $this->smarty->setConfigDir($root . '/config/');
        $this->smarty->setCacheDir($root . '/cache/');
    }


}