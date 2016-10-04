<?php

class Roms_model extends CI_Model {
    function load(){
        $sql = $this->db->from('roms')->get_compiled_select();

        $roms = q(array(
            'sql' => $sql
        ));

        return [
            'roms' => !empty($roms) ? $roms : []
        ];
    }
    function update($new_datas){
        $updated_datas = $user_sites = array();

        //Multidimensional
        $new_datas = multi_array($new_datas);

        foreach($new_datas as $new_data){
            has_key('id',$new_data,'ROM');

            $sql = $this->db->from('roms')->where(['id' => $new_data['id']])->get_compiled_select();

            $current_data = q(array(
                'sql' => $sql,
                'flat' => true
            ));

            $keys = array_keys($new_data);
            $update_data = array();
            $check_keys = array('rom_active');
            $accept_empty_keys = array('rom_active');
            if(!empty($keys)){
                foreach($keys as $key){
                    //Is update key
                    //Value has changed
                    //Value can be set to blank
                    if(!can_update($key,$current_data,$new_data,$check_keys,$accept_empty_keys)) continue;
                    switch($key){
                        case 'rom_active':
                            $update_data[$key] = $new_data[$key];
                            break;
                    }
                }
            }else{
                throw new Exception('Nothing to update');
            }

            if(!empty($update_data)){
                $this->db->update('roms',$update_data,array('id' => $current_data['id']));

                $updated_data = array_merge($current_data,$update_data);

                $updated_datas[] = $updated_data;
            }

        }

        //Check max active games
        $sql = $this->db->from('roms')->where(['rom_active' => 1])->get_compiled_select();
        $active_roms = q(array(
            'sql' => $sql
        ));
        if(count($active_roms) > MAX_ACTIVE_ROMS){
            throw new Exception('The maximum amount of ROMs that be active is ' . MAX_ACTIVE_ROMS . '.');
        }

        //Move physical rom files
        foreach($updated_datas as $updated_data){

            //Moving the ROMs to their respective folders
            $storage_path = "/home/pi/gamestorage/" . $updated_data['file_name'];
            $active_path = "/home/pi/RetroPie/roms/mame-mame4all/" . $updated_data['file_name'];
            if (file_exists($storage_path) || file_exists($active_path)) {
                $move_response = array();
                if(!empty($updated_data['rom_active'])){//Activate
                    $move_response[0] = rename($storage_path, $active_path); //storage -> active folder
                }else{//Deactivate
                    $move_response[0] = rename($active_path, $storage_path); //active -> storage folder
                }
                if($move_response[0] == FALSE){
                    throw new Exception("Error moving the " . $updated_data['file_name'] . " file, please check permissions.");
                }
            }
        }

        //Check max active games

        //Format for response
        return array(
            'roms' => $updated_datas
        );
    }
}
