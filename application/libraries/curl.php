<?php

class Curl{
    function get($hash){
        $hash['action'] = 'GET';
        return $this->_curl_request($hash);
    }
    function post($hash){
        $hash['action'] = 'POST';
        return $this->_curl_request($hash);
    }
    function delete($hash){
        $hash['action'] = 'DELETE';
        return $this->_curl_request($hash);
    }
    function put($hash){
        $hash['action'] = 'PUT';
        return $this->_curl_request($hash);
    }
    private function _curl_request($hash){
        $hash = default_array($hash, array(
            array(
                'keys' => array('url'),
                'required' => true
            ),
            array(
                'keys' => array('data','file_path','user_pwd'),
                'value' => null
            ),
            array(
                'keys' => array('json_request','json_response'),
                'value' => true
            ),
            array(
                'keys' => array('headers'),
                'value' => array()
            ),
            array(
                'keys' => array('gzip'),
                'value' => false
            ),
            array(
                'keys' => array('return_body'),
                'value' => false
            ),
            array(
                'keys' => array('throw_on_non_success'),
                'value' => true
            )
        ));
        if($hash['data'] != null && $hash['action'] != 'GET'){
            if($hash['json_request']){
                $hash['data'] = json_encode($hash['data']);
            }else{
                $hash['data'] = http_build_query($hash['data']);
            }
        }
        $ch = curl_init();

        //Headers
        $headers = array();
        foreach($hash['headers'] as $key => $value){
            $headers[] = $key . ': ' . $value;
        }

        //JSON response
        if($hash['json_response']){
            $headers[] = 'Accept: application/json';
        }

        //Gzip
        if($hash['gzip']){
            curl_setopt($ch, CURLOPT_ENCODING, 'gzip,deflate,sdch');
        }

        //Request type
        switch($hash['action']) {
            case "POST":
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                break;
            case "GET":
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
                break;
            case "PUT":
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
                break;
            case "DELETE":
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
                break;
            default:
                break;
        }

        //Request data
        if(!empty($hash['file_path'])){
            $headers[] = 'Content-Type: application/binary';
            $file = fopen($hash['file_path'], 'r');
            $size = filesize($hash['file_path']);
            $file_data = fread($file, $size);
            curl_setopt($ch, CURLOPT_INFILE, $file);
            curl_setopt($ch, CURLOPT_INFILESIZE, $size);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $file_data);
        }else{
            //JSON request
            if($hash['json_request']){
                $headers[] = 'Content-type: application/json';
            }
            switch($hash['action']){
                case "POST":
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $hash['data']);
                    break;
                case "GET":
                    if($hash['data'] != null){
                        $hash['url'] .= '?' . http_build_query($hash['data']);
                    }
                    break;
                case "PUT":
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $hash['data']);
                    break;
                default:
                    break;
            }
        }

        //Authentication
        if(!empty($hash['user_pwd'])){
            curl_setopt($ch, CURLOPT_USERPWD, $hash['user_pwd']);
        }

        //Base settings
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER , false);
        curl_setopt($ch, CURLOPT_URL, $hash['url']);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, BASE_NAME . " API");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);

        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $body = substr($response, $header_size);
        $response_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if($response === false){
            throw new Exception(curl_error($ch));
        }
        if($hash['throw_on_non_success'] && substr($response_code,0,1) !== "2"){
            throw new Exception('Invalid response code: ' .  $response_code . '.');
        }

        curl_close($ch);

        if($hash['json_response']){
            $body = json_decode($body,true);
        }
        if($hash['return_body']){
            return $body;
        }else{
            return array(
                'headers' => $this->get_headers_from_curl_response($response),
                'body' => $body,
                'response_code' => $response_code,
                'response' => $response
            );
        }
    }
    function get_headers_from_curl_response($response)
    {
        $headers = array();

        $header_text = substr($response, 0, strpos($response, "\r\n\r\n"));

        foreach (explode("\r\n", $header_text) as $i => $line)
            if ($i === 0)
                $headers['http_code'] = $line;
            else
            {
                list ($key, $value) = explode(': ', $line);

                $headers[$key] = $value;
            }

        return $headers;
    }
}