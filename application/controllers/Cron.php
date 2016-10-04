<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Cron extends REST_Controller {

    public function test_get(){
        require_once __DIR__ . '/../resources/PHPMailer/PHPMailerAutoload.php';
//        $mailHeaders = array(
//            'From'=>'affinitiinfiniti@gmail.com',
//            'To'=>'preston_tighe@yahoo.com',
//            'Subject'=>'Email Verification',
//            'Content-type'=>'text/html;charset=iso-8859-1'
//        );
//        $smtp = @Mail::factory('smtp',array(
//            'host'=>'ssl://smtp.gmail.com',
//            'port'=>'465',
//            'auth'=>true,
//            'username'=>'affinitiinfiniti@gmail.com',
//            'password'=>'guestguest'
//        ));
//        $mail = @$smtp->send($parsedReq['email'],$mailHeaders,'<html><a href="http://52.26.234.46/verify/'.$activationKey.'">Click here to verify!</a></html>');

        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->Host = 'ssl://smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = GOOGLE_USER;
        $mail->Password = GOOGLE_PASSWORD;
        $mail->SMTPSecure = 'tls';
        $mail->SMTPDebug = 2;
        $mail->Port = GOOGLE_PASSWORD;

        $mail->setFrom(GOOGLE_USER, BASE_NAME_ABBR);
        $mail->addAddress('preston_tighe@yahoo.com');
        $mail->addReplyTo(GOOGLE_USER, BASE_NAME_ABBR);
//        $mail->isHTML(true);

        $mail->Subject = 'test subject';
        $mail->Body    = 'test body';

        $response = $mail->send();
        if (!$mail->send()) {
            echo "Mailer Error: " . $mail->ErrorInfo;
        } else {
            echo "Message sent!";
        }
    }

    public function build_roms_get(){
        $this->_build_all_roms();
        $this->_build_all_roms_system();
        $this->response(array(
            'message' => 'Building possible ROMs and system ROMs is complete.'
        ),200);
    }
    private function _build_all_roms(){
        $this->db->empty_table('possible_roms');
        $this->db->empty_table('roms');

        function cleanName($name){
            $pos = strpos($name, "(");
            if($pos == FALSE){
                return $name;
            }
            $name = substr($name, 0, $pos);
            return $name;
        }

        $file = fopen(getcwd() . '/documentation/rom_names_desc.csv', "r");

        $roms = array();
        while(($line = fgetcsv($file)) !== FALSE) {

            $game_name = cleanName($line[1]);
            $desc = $line[2];
            $roms[] = array(
                'file_name' => $line[0].".zip",
                'game_name' => $game_name,
                'game_desc' => $desc
            );
        }
        $this->db->insert_batch('possible_roms',$roms);

        fclose($file);

    }
    private function _build_all_roms_system(){

        $active_directory = '/home/pi/RetroPie/roms/mame-mame4all/';
        $storage_directory = '/home/pi/gamestorage/';
        $active_directory_scan = scandir($active_directory);
        $inactive_directory_scan = scandir($storage_directory);

        if(count($active_directory_scan) > 1) {
            for ($x = 2; $x < count($active_directory_scan); $x++) {
                if(strpos($active_directory_scan[$x], '.zip') !== FALSE){
                    $sql = $this->db->from('possible_roms')->where(['file_name' => $active_directory_scan[$x]])->get_compiled_select();

                    $rom = q(array(
                        'sql' => $sql,
                        'flat' => true
                    ));

                    if(empty($rom)) throw new Exception('Could not find ROM with filename' . $active_directory_scan[$x] . '.');

                    $this->db->insert('roms',array(
                        'game_name' => $rom['game_name'],
                        'file_name' => $active_directory_scan[$x],
                        'rom_loc' => $active_directory,
                        'image_loc' => '/images/' . str_replace('zip','jpeg',$rom['file_name']),
                        'rom_active' => 1,
                        'game_desc' => $rom['game_desc']
                    ),array('id' => $rom['id']));
                }
            }
        }

        if(count($inactive_directory_scan) > 1) {
            for ($x = 2; $x < count($inactive_directory_scan); $x++) {
                if(strpos($inactive_directory_scan[$x], '.zip') !== FALSE){
                    $sql = $this->db->from('possible_roms')->where(['file_name' => $inactive_directory_scan[$x]])->get_compiled_select();

                    $rom = q(array(
                        'sql' => $sql,
                        'flat' => true
                    ));

                    if(empty($rom)) throw new Exception('Could not find ROM with filename ' . $inactive_directory_scan[$x] . '.');

                    if($x > 54){
                        $test = 2;
                    }

                    $this->db->insert('roms',array(
                        'game_name' => $rom['game_name'],
                        'file_name' => $inactive_directory_scan[$x],
                        'rom_loc' => $storage_directory,
                        'image_loc' => '/images/' . str_replace('zip','jpeg',$rom['file_name']),
                        'rom_active' => 0,
                        'game_desc' => $rom['game_desc']
                    ),array('id' => $rom['id']));
                }
            }
        }
    }
    public function do_something(){
        //Left here for example purposes

//        if($this->input->is_cli_request() || ENVIRONMENT == 'development'){
//            try{
//                q('BEGIN');
//                //Do something here
//                q('COMMIT');
//                echo 'do_something' . "\n";
//            }catch(Exception $e){
//                q('ROLLBACK');
//                backend_log(array(
//                    'error' => $e->getMessage()
//                ),$e);
//            }
//        }else{
//            show_404();
//        }
    }
}



