<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Cron extends CI_Controller {

    public function test(){
        echo 'cron test route';
    }

    public function build_all_roms(){
        function cleanName($name){
            $pos = strpos($name, "(");
            if($pos == FALSE){
                return $name;
            }
            $name = substr($name, 0, $pos);
            return $name;
        }

        $file = fopen(getcwd() . '/documentation/sql/rom_names.csv', "r");

        $roms = array();
        while(($line = fgetcsv($file)) !== FALSE) {

            $game_name = cleanName($line[1]);
            $roms[] = array(
                'file_name' => $line[0].".zip",
                'game_name' => $game_name
            );
        }
        $this->db->insert_batch('roms',$roms);

        fclose($file);

        echo 'build_all_roms done';
    }
    public function build_system_roms(){
        $active_directory = '/home/pi/RetroPie/roms/mame-mame4all/';
        $storage_directory = '/home/pi/gamestorage/';
        $active_directory_scan = scandir($active_directory);
        $inactive_directory_scan = scandir($storage_directory);

        if(count($active_directory_scan) > 1) {
            for ($x = 2; $x < count($active_directory_scan); $x++) {
                if(strpos($active_directory_scan[$x], '.zip') !== FALSE){
                    $sql = $this->db->from('roms')->where(['file_name' => $active_directory_scan[$x]])->get_compiled_select();

                    $rom = q(array(
                        'sql' => $sql,
                        'flat' => true
                    ));

                    if(empty($rom)) throw new Exception('Could not find ROM with filename' . $active_directory_scan[$x] . '.');

                    $this->db->update('roms',array(
                        'file_name' => $active_directory_scan[$x],
                        'rom_loc' => $active_directory,
                        'image_loc' => '/images/' . $rom['game_name'],
                        'rom_active' => 1
                    ),array('id' => $rom['id']));
                }
            }
        }

        if(count($inactive_directory_scan) > 1) {
            for ($x = 2; $x < count($inactive_directory_scan); $x++) {
                if(strpos($inactive_directory_scan[$x], '.zip') !== FALSE){
                    $sql = $this->db->from('roms')->where(['file_name' => $inactive_directory_scan[$x]])->get_compiled_select();

                    $rom = q(array(
                        'sql' => $sql,
                        'flat' => true
                    ));

                    if(empty($rom)) throw new Exception('Could not find ROM with filename' . $inactive_directory_scan[$x] . '.');

                    $this->db->update('roms',array(
                        'file_name' => $inactive_directory_scan[$x],
                        'rom_loc' => $storage_directory,
                        'image_loc' => '/images/' . $rom['game_name'],
                        'rom_active' => 0
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



