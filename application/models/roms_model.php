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
            }

            $updated_data = array_merge($current_data,$update_data);

            $updated_datas[] = $updated_data;
        }

        //Format for response
        return array(
            'roms' => $updated_datas
        );
    }
}
