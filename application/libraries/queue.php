<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Queue {
    var $ci = null;
    var $events = array();
    var $notifications = array();
    var $index = array();
    var $unindex = array();
    var $functions = array();
    var $force_functions = array();

    var $queues = array('notifications','events','functions','index','unindex');
    function __construct(){
        $this->ci =& get_instance();
    }

    function notification($type,$params,$users,$extras = null,$private_message_templates = null,$subjects = array()){
        if(empty($this->notifications)) $this->notifications = array(
            '0' => array(),
            '1' => array(),
            '2' => array(),
            '3' => array(),
        );
        //Format types & private message templates
        if(!empty($params[0]) && is_array($params[0])){
            $notification_count = count($users);
            for($i = 0;$i < $notification_count;$i++){
                $this->notifications[0][] = $type;
                $this->notifications[1][] = $params[$i];
                $this->notifications[2][] = $users[$i];
                $this->notifications[3][] = !empty($extras[$i]) ? $extras[$i] : null;
                $this->notifications[4][] = $private_message_templates;
                $this->notifications[5][] = !empty($subjects[$i]) ? $subjects[$i] : null;
            }
        }else{
            $this->notifications[0][] = $type;
            $this->notifications[1][] = $params;
            $this->notifications[2][] = $users;
            $this->notifications[3][] = $extras;
            $this->notifications[4][] = $private_message_templates;
            $this->notifications[5][] = $subjects;
        }

    }
    function event(){
        $this->events[] = func_get_args();
    }
    function index($items,$index = null){
        if($index == null) throw new Exception('A index type is required.');
        $this->index[] = array(
            'items' => $items,
            'index' => $index
        );
    }
    function unindex($items,$index = null){
        if($index == null) throw new Exception('A index type is required.');
        $this->unindex[] = array(
            'items' => $items,
            'index' => $index
        );
    }
    function fn($method,$params,$class = null){
        if(empty($this->functions)) $this->functions = array(
            'method' => array(),
            'params' => array(),
            'class' => array()
        );
        $this->functions['method'][] = $method;
        $this->functions['params'][] = $params;
        $this->functions['class'][] = $class;
    }
    function force_fn($method,$params,$class = null,$run_normally = false){
        if(empty($this->force_functions)) $this->force_functions = array(
            'method' => array(),
            'params' => array(),
            'class' => array()
        );
        $this->force_functions['method'][] = $method;
        $this->force_functions['params'][] = $params;
        $this->force_functions['class'][] = $class;

        if($run_normally){
            if(!empty($class)){
                call_user_func_array(array($class,$method), $params);
            }else{
                call_user_func_array($method, $params);
            }
        }
    }
    function track(){
        $this->tracks[] = func_get_args();
    }
    function webhook(){
        $this->webhooks[] = func_get_args();
    }
    private function _flush_tracks($status,$message = null){
        if(!empty($this->tracks)){
            global $admin_login;
            global $test_payment;
            if(!$admin_login && !$test_payment){
                $sift = sift();
                global $guest_id;
                foreach($this->tracks as $track){
                    //Guest tracks
                    if(!empty($guest_id)){
                        //Remove an association to a user if the request fails
                        if($status != '$success'){
                            if($track[0] == '$create_account') continue;
                            $track[1]['$user_id'] = '';
                        }
                        $track[1]['$session_id'] = $guest_id;
                    }

                    //Status of request
                    $track[1]['track_status'] = $status;

                    //Error of request
                    if(!empty($message)){
                        $track[1]['error'] = $message;
                    }
                    $response = call_user_func_array(array($sift,'track'), $track);
                }
            }
            $this->tracks = array();
        }
    }
    function flush($just_cache = false){
        //Email and private message notifications
        if(!empty($this->notifications)){
            $this->ci->load->library('notifications');
            call_user_func_array(array($this->ci->notifications,'send'), $this->notifications);
            $this->notifications = array();
        }

        //Real time events
        if(!empty($this->events)){
            $this->ci->load->library('pusher');
            foreach($this->events as $event){
                call_user_func_array(array($this->ci->pusher,'trigger'), $event);
            }
            $this->events = array();
        }

        //Algolia indexing
        if(!empty($this->index) || !empty($this->unindex)){
            require_once __DIR__ . '/../resources/Algolia/algoliasearch.php';
            $client = new \AlgoliaSearch\Client(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

            //Index
            foreach($this->index as $hash){
                $index = $client->initIndex($hash['index'] . (ENVIRONMENT == 'development' ? '_test' : ''));
                $index->partialUpdateObjects($hash['items']);
            }
            $this->index = array();

            //Unindex
            foreach($this->unindex as $hash){
                $index = $client->initIndex($hash['index'] . (ENVIRONMENT == 'development' ? '_test' : ''));
                $index->deleteObjects($hash['items']);
            }
            $this->unindex = array();
        }

        //Fraud tracks
        if(!empty($this->tracks)){
            $this->_flush_tracks('$success');
        }

        //Webhooks
        if(!empty($this->webhooks)){
            //Don't add to webhook queue if user doesn't have any webhooks
            $uid = $this->webhooks[0][1];
            $sql = $this->ci->db->from('webhooks')->where('uid',$uid)->where('active',1)->get_compiled_select();
            $items = q(array(
                'sql' => $sql,
                'default' => array()
            ));
            if(!empty($items)){
                foreach($this->webhooks as $webhook){
                    $hash = array(
                        'type' => $webhook[0],
                        'uid' => $webhook[1],
                        'data' => $webhook[2]
                    );
                    if(!empty($webhook[3])){
                        $hash['test'] = $webhook[3];
                    }
                    queue_message(
                        IRONMQ_WEBHOOKS_QUEUE,
                        $hash,
                        array(
                            'delay' => 0
                        )
                    );
                }
            }
            $this->webhooks = array();
        }


        //Run certain methods
        if(!empty($this->functions)){
            for($i = 0,$count = count($this->functions['method']);$i < $count;$i++){
                if(!empty($this->functions['class'][$i])){
                    call_user_func_array(array($this->functions['class'][$i],$this->functions['method'][$i]), $this->functions['params'][$i]);
                }else{
                    call_user_func_array($this->functions['method'][$i], $this->functions['params'][$i]);
                }
            }
            $this->functions = array();
        }
    }
    function force_flush($message){
        //Clear all on success queues
        foreach($this->queues as $queue){
            $this->{$queue} = array();
        }

        //Run certain methods that need to be called no matter what
        if(!empty($this->force_functions)){
            for($i = 0,$count = count($this->force_functions['method']);$i < $count;$i++){
                if(!empty($this->force_functions['class'][$i])){
                    call_user_func_array(array($this->force_functions['class'][$i],$this->force_functions['method'][$i]), $this->force_functions['params'][$i]);
                }else{
                    call_user_func_array($this->force_functions['method'][$i], $this->force_functions['params'][$i]);
                }
            }
            $this->force_functions = array();
        }

        //Flush fraud tracks with failure
        $this->_flush_tracks('$failure',$message);

        //Flush anything created from the forced functions
        $this->flush();
    }
}