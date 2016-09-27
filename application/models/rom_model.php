<?php
/**
 * Created by PhpStorm.
 * User: claylewis
 */

class Rom_model extends CI_Model {

    function get_active_roms(){
        $activeRoms = $this->db->get_where('roms', (array('rom_active' => 1)));
        return $activeRoms.result();
    }

    function get_inactive_roms(){
        $activeRoms = $this->db->get_where('roms', (array('rom_active' => 0)));
        return $activeRoms.result();
    }

    function activate_rom($gid){
        try{
            $this->db->select("file_name");
            $fileName = $this->db->get_where('roms', (array('gid' => $gid)));
            $response = rename("/home/pi/gamestorage/{$fileName}", "/home/pi/RetroPie/roms/mame-mame4all/{$fileName}");
            if($response = 0){
                throw new Exception('Error activating the ROM.');
            }
            else {
                $this->db->set('rom_active', 1);
                $this->db->where('gid', $gid);
                $this->db->update('roms');
            }
        }
        catch(Exception $e){
            throw $e;
        }
    }

    function deactivate_rom($gid){
        try{
            $this->db->select("file_name");
            $fileName = $this->db->get_where('roms', (array('gid' => $gid)));
            $response = rename("/home/pi/RetroPie/roms/mame-mame4all/{$fileName}", "/home/pi/gamestorage/{$fileName}");
            if($response == 0){
                throw new Exception('Error dectivating the ROM.');
            }else{
                $this->db->set('rom_active', 0);
                $this->db->where('gid', $gid);
                $this->db->update('roms');
            }
        }
        catch(Exception $e){
            throw $e;
        }
        return 1;
    }


}
