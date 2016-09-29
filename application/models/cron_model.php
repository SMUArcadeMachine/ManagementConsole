<?php

class Cron_model extends CI_Model {
    function update_expired_listings(){
        $time_start = microtime(true);

        //Select all expired listings uid and id
        $updated_status_code = 2;
        $sql = "SELECT id,uid,title,status FROM listings WHERE status = 1 AND (date_created <= (CURDATE() - INTERVAL 90 DAY)";
        $expired_listings = q($sql);
        if(!$expired_listings){
            backend_log(array(
                'method' => 'update_expired_listings',
                'status' => 'success',
                'count' => 0
            ));
            return;
        }

        //Get IDs
        $counter = 0;
        $listing_ids = array();
        foreach($expired_listings as &$listing){
            $counter++;
            $listing['status'] = $updated_status_code;
            $listing_ids[] = $listing['id'];
        }

        //Updates expiration on listings
        $result = $this->db->set('modified_on','NOW()',false)->set('status',$updated_status_code)->where_in('id',$listing_ids)->update('listings');
        if(!$result){
            throw new Exception('Update fail');
        }

        //Deletes listings from index
        $this->load->model('listing_model');
        $this->listing_model->delete_index($expired_listings);
        $this->queue->flush();
        $time_end  = microtime(true);
        $time = $time_end - $time_start;
        backend_log(array(
            'method' => 'update_expired_listings',
            'status' => 'success',
            'time' => $time . 'sec',
            'count' => $counter
        ));
    }
}
