<?php
class MY_Router extends CI_Router {
    function _set_routing(){
        //Accept options requests
        if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
            header('HTTP/1.1: ' . 204);
            header('Status: ' . 204);
            exit;
        }

        //Proxy to Ember frontend - TODO
//        if(ENVIRONMENT == 'production' && strpos(BASE_URL_NO_SCHEME,$_SERVER['HTTP_HOST']) !== false){
//            $index_page = file_get_contents(getcwd() . '/index.html');
//            echo $index_page;
//            exit;
//        }

        parent::_set_routing();

    }
}