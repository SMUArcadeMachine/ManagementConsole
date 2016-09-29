<?php
class MY_Router extends CI_Router {
    function _set_routing(){
        //Accept options requests
        if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
            header('HTTP/1.1: ' . 204);
            header('Status: ' . 204);
            exit;
        }

        //Proxy to robots.txt, sitemap.xml, sitemaps, or else the index page
//        if(ENVIRONMENT == 'production' && strpos(BASE_URL_NO_SCHEME,$_SERVER['HTTP_HOST']) !== false){
//            $full_url = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
//            if(strpos($full_url,BASE_URL . 'robots.txt') !== false){
//                header('Content-Type: text/plain');
//                echo file_get_contents(STATIC_URL.'robots.txt');
//            }else if(strpos($full_url,BASE_URL . 'sitemap.xml') !== false){
//                header('Content-Type: application/xml');
//                echo file_get_contents(STATIC_URL.'sitemap.xml');
//            }else if(strpos($full_url,BASE_URL . 'sitemaps/') !== false){
//                header('Content-Type: binary/octet-stream');
//                echo file_get_contents(STATIC_URL.substr($_SERVER['REQUEST_URI'], 1));
//            }else{
//                $user_agent = $_SERVER['HTTP_USER_AGENT'];
//                $index_page = file_get_contents(STATIC_URL.'index.html');
//                if(strpos($user_agent,'Prerender') !== false){
//                    echo str_replace(STATIC_URL,STATIC_URL_S3,$index_page);
//                }else{
//                    echo $index_page;
//                }
//            }
//            exit;
//        }

        parent::_set_routing();

    }
}