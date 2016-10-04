<?php
if(!function_exists('sanitize_array')){
    function sanitize_array($array){
        if(empty($array)){
            return;
        }
        $CI = &get_instance();
        foreach($array as $item){
            $_POST[$item] = $CI->security->sanitize_filename($_POST[$item]);
        }
    }
}
global $transacting;
$transacting = false;
if(!function_exists('q')){
    function q($hash){
        //sql
        //flat

        if(gettype($hash) == 'string'){
            $hash = array(
                'sql' => $hash
            );
        }
        $hash = default_array($hash, array(
            array(
                'keys' => array('sql'),
                'value' => null,
                'required' => true
            ),
            array(
                'keys' => array('count','flat'),
                'value' => false
            ),
            array(
                'keys' => array('filter'),
                'value' => true
            ),
            array(
                'keys' => array('callback','default'),
                'value' => null
            )
        ));

        $data = false;
        $CI = & get_instance();

        //Query
        $query = $CI->db->query($hash['sql']);

        //Only return row count
        if($hash['count']){
            return $query->num_rows();
        }

        //Grab results
        $filter_columns = array('ip');
        if(is_object($query) && (!empty($query->num_rows) || !empty($query->result_id->num_rows))){
            foreach ($query->result_array() as $row){
                foreach($filter_columns as $filter){
                    if($hash['filter'] && array_key_exists($filter,$row)) unset($row[$filter]);
                }
                $data[] = $row;
            }
        }

        //If no results set data to null(differentiate between false and null - null = no results found)
        if($data === false){
            $data = $hash['default'];
        }

        //Call callback filter
        if(!is_null($hash['callback']) && !empty($data)){
            $response = call_user_func_array($hash['callback'],array($data));
            if(!empty($response)) $data = $response;
        }

        //Flatten array
        if($hash['flat'] === true && !empty($data)){
            $data = array_flatten($data);
        }

        global $transacting;
        if($hash['sql'] == 'BEGIN'){
            $transacting = true;
        }else if($hash['sql'] == 'ROLLBACK'){
            $transacting = false;
        }else if($hash['sql'] == 'COMMIT'){
            //Flush queue after commit
            $CI->queue->flush();
            $transacting = false;
        }
        return $data;
    }
}
if(!function_exists('lookup_user')){
    function lookup_user($uid_or_username = null,$fail_message = 'User lookup failed.',$throw_error = true){
        if(is_numeric($uid_or_username)){
            if(empty($uid_or_username)) throw new Exception('UID is empty.');
            $where = array('uid' => $uid_or_username);
        }else{
            $uid_or_username = urldecode($uid_or_username);
            if(empty($uid_or_username)) throw new Exception('Username is empty.');
            $where = array('username' => $uid_or_username);
        }
        $CI = & get_instance();
        $sql = $CI->db->from('users')->where($where)->get_compiled_select();
        $user = q(array(
            'sql' => $sql,
            'flat' => true
        ));
        if($throw_error && !$user) throw new Exception($fail_message);

        if(!empty($user)){
            $user['id'] = $user['uid'];
        }

        return $user;
    }
}
if(!function_exists('lookup_failed_logins')){
    function lookup_failed_logins($uid){
        $CI = & get_instance();
        $sql = $CI->db->from('user_failed_login_history')->where(array('uid' => $uid,'ip' => $_SERVER[IP_HEADER]))->get_compiled_select();
        $failed_history = q(array(
            'sql' => $sql,
            'flat' => true
        ));
        return $failed_history;
    }
}
if(!function_exists('update_user')){
    function update_user($set,$uid){
        if($set == null) throw new Exception('User set data is empty.');
        if($uid == null) throw new Exception('UID is empty.');

        $CI = & get_instance();
        if(!$CI->db->update('users', $set, array('uid' => $uid))) throw new Exception('Error updating user.');
    }
}
if(!function_exists('array_flatten')){
    function array_flatten($array) {
        if (!is_array($array)) {
            return FALSE;
        }
        $result = array();
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $result = array_merge($result, array_flatten($value));
            }
            else {
                $result[$key] = $value;
            }
        }
        return $result;
    }
}
if(!function_exists('merge_request')){
    function merge_request($params,$e) {
        $CI = &get_instance();
        if(!empty($CI->request->method)){
            $params['method'] = $CI->request->method;
        }
        if(!empty($_SERVER['REQUEST_URI'])){
            $params['uri'] = $_SERVER['REQUEST_URI'];
        }
        if(!empty($params['data']['password'])){
            unset($params['data']['password']);
        }
        if(!empty($e)){
            $params['file'] = $e->getFile();
            $params['line'] = $e->getLine();
            $params['trace'] = $e->getTraceAsString();
        }
        $params['ip'] = !empty($_SERVER[IP_HEADER]) ? $_SERVER[IP_HEADER] : null;
        return $params;
    }
}
if(!function_exists('backend_log')){
    function backend_log($message = array(),$e = null) {
        openlog('php', LOG_CONS | LOG_NDELAY | LOG_PID, LOG_USER | LOG_PERROR);
        $message['type'] = 'backend';
        $message = merge_request($message,$e);
        syslog(LOG_ERR, json_encode($message));
        closelog();
    }
}
if(!function_exists('time_ago')){
    function time_ago($timestamp, $granularity=2, $format='M jS Y g:iA'){

        $difference = time() - $timestamp;

        if($difference < 0) return 'Few seconds ago';	// if difference is lower than zero check server offset
        elseif($difference < 864000){			// if difference is over 10 days show normal time form

            $periods = array('week' => 604800,'day' => 86400,'hr' => 3600,'min' => 60,'sec' => 1);
            $output = '';
            foreach($periods as $key => $value){

                if($difference >= $value){

                    $time = round($difference / $value);
                    $difference %= $value;

                    $output .= ($output ? ' ' : '').$time.' ';
                    $output .= (($time > 1 && $key == 'day') ? $key.'s' : $key);

                    $granularity--;
                }
                if($granularity == 0) break;
            }
            return ($output ? $output : 'Few seconds').' ago';
        }
        else return date($format, $timestamp);
    }
}
if(!function_exists('parse_ids')){
    function parse_ids($data, $key = 'id',$possible_null = false){
        if(!empty($data) && gettype($data[0]) == 'array'){
            $ids = array();
            foreach($data as $item){
                if(empty($item[$key])){
                    if($possible_null) continue;
                    throw new Exception('Parse IDs key: ' . $key . ' is invalid.');
                }else{
                    $ids[] = $item[$key];
                }
            }
            return $ids;
        }else{
            return $data;
        }
    }
}
if(!function_exists('ext')){
    function ext($path){
        return strtolower(pathinfo(preg_replace('/\?.*/', '', $path),PATHINFO_EXTENSION));
    }
}
if(!function_exists('check_ext')){
    function check_ext($file_original_name, $file_name, $tmp_name){
        $ext = ext($file_original_name);
        if(empty($ext)){
            $image_type = exif_imagetype($tmp_name);
            if ($image_type == IMAGETYPE_GIF) {
                $ext = 'gif';
            }else if($image_type == IMAGETYPE_JPEG) {
                $ext = 'jpg';
            }else if($image_type == IMAGETYPE_PNG) {
                $ext = 'png';
            }
            if (!empty($ext) && strpos($file_name, $ext) === false) {
                $file_name .= '.' . $ext;
            }
        }
        return $file_name;
    }
}
if(!function_exists('encode_url')){
    function encode_url($arr, $prefix=null){
        if (!is_array($arr))
            return $arr;

        $r = array();
        foreach ($arr as $k => $v) {
            if (is_null($v))
                continue;

            if ($prefix && $k && !is_int($k))
                $k = $prefix."[".$k."]";
            else if ($prefix)
                $k = $prefix."[]";

            if (is_array($v)) {
                $r[] = self::encode($v, $k, true);
            } else {
                $r[] = urlencode($k)."=".urlencode($v);
            }
        }

        return implode("&", $r);
    }
}
if(!function_exists('sluggify')){
    function sluggify($url,$keep_extension = false){
        # Prep string with some basic normalization
        $ext = '';
        if($keep_extension){
            $ext = ext($url);
            if(!empty($ext)){
                $ext = '.' . $ext;
                $url = str_ireplace($ext,'',$url);
            }
        }
        $url = strtolower($url);
        $url = strip_tags($url);
        $url = stripslashes($url);
        $url = html_entity_decode($url);

        # Remove quotes (can't, etc.)
        $url = str_replace('\'', '', $url);

        # Replace non-alpha numeric with hyphens
        $match = '/[^a-z0-9]+/';
        $replace = '-';
        $url = preg_replace($match, $replace, $url);

        $url = trim($url, '-');

        if($keep_extension){
            $url .= $ext;
        }
        return $url;
    }
}
if(!function_exists('filter_array')){
    function filter_array($array,$keys,$remove = true){
        if($remove){
            foreach($keys as $key){
                if(array_key_exists ($key,$array)) unset($array[$key]);
            }
        }else{
            foreach($array as $key => $value){
                if(!in_array($key,$keys)){
                    if(array_key_exists ($key,$array)) unset($array[$key]);
                }
            }
        }
        return $array;
    }
}
if(!function_exists('convert')){
    function convert($datas,$keys,$type){
        if(empty($datas)) return $datas;

        //Multidimensional
        $datas = multi_array($datas);

        $new_array = array();
        foreach($datas as $data){
            if(empty($keys)){
                $new_array[] = call_user_func($type, $data);
            }else{
                foreach($data as $key => $val){
                    if(array_key_exists($key,$data)){
                        if(in_array($key,$keys) && !is_null($data[$key])){
                            $new_array[$key] = call_user_func($type, $data[$key]);
                        }else{
                            $new_array[$key] = $data[$key];
                        }
                    }
                }
            }
        }
        return $new_array;
    }
}
if(!function_exists('convert_bool')){
    function convert_bool($array,$keys){
        foreach($keys as $key){
            $array[$key] = filter_var($array[$key], FILTER_VALIDATE_BOOLEAN);
        }
        return $array;
    }
}
if(!function_exists('is_id_array')){
    function is_id_array($array){
        //Not an array at all
        if(gettype($array) != 'array') return false;

        //Array but no ids included
        if(empty($array)) return true;

        foreach($array as $value){
            if(gettype($value) != 'string' && gettype($value) != 'integer'){
                return false;
            }
        }
        return true;
    }
}
if(!function_exists('uniq_hash')){
    function uniq_hash($length = null){
        $hash = md5(uniqid());
        return $length == null ? $hash : substr($hash,0,$length);
    }
}
if(!function_exists('encodeURI')){
    function encodeURI($url) {
        // http://php.net/manual/en/function.rawurlencode.php
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/encodeURI
        $unescaped = array(
            '%2D'=>'-','%5F'=>'_','%2E'=>'.','%21'=>'!', '%7E'=>'~',
            '%2A'=>'*', '%27'=>"'", '%28'=>'(', '%29'=>')'
        );
        $reserved = array(
            '%3B'=>';','%2C'=>',','%2F'=>'/','%3F'=>'?','%3A'=>':',
            '%40'=>'@','%26'=>'&','%3D'=>'=','%2B'=>'+','%24'=>'$'
        );
        $score = array(
            '%23'=>'#'
        );
        return strtr(rawurlencode($url), array_merge($reserved,$unescaped,$score));

    }
}
if(!function_exists('default_array')){
    function default_array($array, $hash) {
        if(gettype($hash) != 'array') throw new Exception('Default array was not supplied an array.');
        foreach($hash as $item){
            $required = !empty($item['required']);
            $force = !empty($item['force']);
            foreach($item['keys'] as $key){
                if($force){
                    $array[$key] = $item['value'];
                    continue;
                }
                if(!array_key_exists($key, $array)){
                    if($required) throw new Exception('Hash key "' . $key . '" is required.');
                    $array[$key] = $item['value'];
                }
            }
        }
        return $array;
    }
}
if(!function_exists('is_email')){
    function is_email($email){
        return preg_match( "/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/", $email );
    }
}
if(!function_exists('valid_username')){
    function valid_username($username,$error_message = null,$error_message_invalid = null){
        $CI = &get_instance();

        if(!is_email($username)) throw new Data_error(array('message' => $error_message_invalid ?: 'Invalid email ' . $username . '.','type' => 'email'));

        //Username lookup
        $data = array(
            'username' => $username,
            'active' => 1
        );
        $sql = $CI->db->from('users')->where($data)->get_compiled_select();
        $user = q($sql);
        if($user) throw new Data_error(array('message' => $error_message ?: 'Username `' . $username . '`` is already in use.','type' => 'email'));
    }
}
if(!function_exists('starts_with')){
    function starts_with($haystack, $needle){
        $length = strlen($needle);
        return (substr($haystack, 0, $length) === $needle);
    }
}
if(!function_exists('objectToArray')){
    function objectToArray ($object) {
        if(!is_object($object) && !is_array($object))
            return $object;

        return array_map('objectToArray', (array) $object);
    }
}
if(!function_exists('rand_num')){
    function rand_num($digits = 6) {
        return rand(pow(10, $digits-1), pow(10, $digits)-1);
    }
}
if(!function_exists('multi_array')){
    function multi_array($a){
        if(!is_array($a)) return array($a);
        if(array_key_exists('0',$a)){
            return $a;
        }else{
            return array($a);
        }
    }
}
if(!function_exists('has_key')){
    function has_key($key,$array,$resource_type = null){
        if(!array_key_exists($key,$array)) throw new Exception('No `' . $key . '` supplied' . ($resource_type ? ' in ' . $resource_type . ' resource.' : '.'));
    }
}
if(!function_exists('has_key')){
    function has_keys($keys,$array,$resource_type = null){
        $has_keys = true;
        foreach($keys as $key){
            has_key($key, $array,$resource_type);
        }
        return $has_keys;
    }
}
if(!function_exists('can_update')){
    function can_update($key,$current_data,$new_data,$check_keys,$accept_empty_keys,$accept_same_keys = array()){
        if($check_keys === false){
            if($key == 'id'){
                return false;
            }else{
                return true;
            }
        }else{
            if(!in_array($key,$check_keys)){
                return false;
            }
            if(empty($accept_same_keys) || !in_array($key,$accept_same_keys)){
                if(array_key_exists($key,$current_data) && $current_data[$key] == $new_data[$key]){
                    return false;
                }
            }
            if(empty($new_data[$key]) && !in_array($key,$accept_empty_keys)){
                return false;
            }
            return true;
        }
    }
}
if(!function_exists('create_map')){
    function create_map($datas, $key = 'id'){
        $map = array();
        foreach($datas as $data){
            $map[$data[$key]] = $data;
        }
        return $map;
    }
}
if(!function_exists('country_to_country_code')){
    function country_to_country_code($country) {
        $country_hash = array(
            'Afghanistan' => 'AF',
            'Aland Islands' => 'AX',
            'Albania' => 'AL',
            'Algeria' => 'DZ',
            'American Samoa' => 'AS',
            'Andorra' => 'AD',
            'Angola' => 'AO',
            'Anguilla' => 'AI',
            'Antarctica' => 'AQ',
            'Antigua And Barbuda' => 'AG',
            'Argentina' => 'AR',
            'Armenia' => 'AM',
            'Aruba' => 'AW',
            'Australia' => 'AU',
            'Austria' => 'AT',
            'Azerbaijan' => 'AZ',
            'Bahamas' => 'BS',
            'Bahrain' => 'BH',
            'Bangladesh' => 'BD',
            'Barbados' => 'BB',
            'Belarus' => 'BY',
            'Belgium' => 'BE',
            'Belize' => 'BZ',
            'Benin' => 'BJ',
            'Bermuda' => 'BM',
            'Bhutan' => 'BT',
            'Bolivia' => 'BO',
            'Bosnia And Herzegovina' => 'BA',
            'Bosnia-Herzegovina' => 'BA',
            'Botswana' => 'BW',
            'Bouvet Island' => 'BV',
            'Brazil' => 'BR',
            'British Indian Ocean Territory' => 'IO',
            'Brunei Darussalam' => 'BN',
            'Bulgaria' => 'BG',
            'Burkina Faso' => 'BF',
            'Burundi' => 'BI',
            'Cambodia' => 'KH',
            'Cameroon' => 'CM',
            'Canada' => 'CA',
            'Cape Verde' => 'CV',
            'Cayman Islands' => 'KY',
            'Central African Republic' => 'CF',
            'Chad' => 'TD',
            'Chile' => 'CL',
            'China' => 'CN',
            'Christmas Island' => 'CX',
            'Cocos (Keeling) Islands' => 'CC',
            'Colombia' => 'CO',
            'Comoros' => 'KM',
            'Congo' => 'CG',
            'Congo, Democratic Republic' => 'CD',
            'Cook Islands' => 'CK',
            'Costa Rica' => 'CR',
            'Cote D\'Ivoire' => 'CI',
            'Croatia' => 'HR',
            'Cuba' => 'CU',
            'Cyprus' => 'CY',
            'Czech Republic' => 'CZ',
            'Denmark' => 'DK',
            'Djibouti' => 'DJ',
            'Dominica' => 'DM',
            'Dominican Republic' => 'DO',
            'Ecuador' => 'EC',
            'Egypt' => 'EG',
            'El Salvador' => 'SV',
            'Equatorial Guinea' => 'GQ',
            'Eritrea' => 'ER',
            'Estonia' => 'EE',
            'Ethiopia' => 'ET',
            'Falkland Islands (Malvinas)' => 'FK',
            'Falkland Islands' => 'FK',
            'Faroe Islands' => 'FO',
            'Fiji' => 'FJ',
            'Finland' => 'FI',
            'France' => 'FR',
            'French Guiana' => 'GF',
            'French Polynesia' => 'PF',
            'French Southern Territories' => 'TF',
            'Gabon' => 'GA',
            'Gambia' => 'GM',
            'Georgia' => 'GE',
            'Germany' => 'DE',
            'Ghana' => 'GH',
            'Gibraltar' => 'GI',
            'Greece' => 'GR',
            'Greenland' => 'GL',
            'Grenada' => 'GD',
            'Guadeloupe' => 'GP',
            'Guam' => 'GU',
            'Guatemala' => 'GT',
            'Guernsey' => 'GG',
            'Guinea' => 'GN',
            'Guinea-Bissau' => 'GW',
            'Guyana' => 'GY',
            'Haiti' => 'HT',
            'Heard Island & Mcdonald Islands' => 'HM',
            'Holy See (Vatican City State)' => 'VA',
            'Honduras' => 'HN',
            'Hong Kong' => 'HK',
            'Hungary' => 'HU',
            'Iceland' => 'IS',
            'India' => 'IN',
            'Indonesia' => 'ID',
            'Iran, Islamic Republic Of' => 'IR',
            'Iraq' => 'IQ',
            'Ireland' => 'IE',
            'Isle Of Man' => 'IM',
            'Israel' => 'IL',
            'Italy' => 'IT',
            'Jamaica' => 'JM',
            'Japan' => 'JP',
            'Jersey' => 'JE',
            'Jordan' => 'JO',
            'Kazakhstan' => 'KZ',
            'Kenya' => 'KE',
            'Kiribati' => 'KI',
            'Korea' => 'KR',
            'Korea (+South)' => 'KR',
            'Korea (+North)' => 'KR',
            'Kuwait' => 'KW',
            'Kyrgyzstan' => 'KG',
            'Lao People\'s Democratic Republic' => 'LA',
            'Latvia' => 'LV',
            'Lebanon' => 'LB',
            'Lesotho' => 'LS',
            'Liberia' => 'LR',
            'Libyan Arab Jamahiriya' => 'LY',
            'Liechtenstein' => 'LI',
            'Lithuania' => 'LT',
            'Luxembourg' => 'LU',
            'Macao' => 'MO',
            'Macedonia' => 'MK',
            'Madagascar' => 'MG',
            'Malawi' => 'MW',
            'Malaysia' => 'MY',
            'Maldives' => 'MV',
            'Mali' => 'ML',
            'Malta' => 'MT',
            'Marshall Islands' => 'MH',
            'Martinique' => 'MQ',
            'Mauritania' => 'MR',
            'Mauritius' => 'MU',
            'Mayotte' => 'YT',
            'Mayotte Island' => 'YT',
            'Mexico' => 'MX',
            'Micronesia, Federated States Of' => 'FM',
            'Moldova' => 'MD',
            'Monaco' => 'MC',
            'Mongolia' => 'MN',
            'Montenegro' => 'ME',
            'Montserrat' => 'MS',
            'Morocco' => 'MA',
            'Mozambique' => 'MZ',
            'Myanmar' => 'MM',
            'Namibia' => 'NA',
            'Nauru' => 'NR',
            'Nepal' => 'NP',
            'Netherlands' => 'NL',
            'Netherlands Antilles' => 'AN',
            'New Caledonia' => 'NC',
            'New Zealand' => 'NZ',
            'Nicaragua' => 'NI',
            'Niger' => 'NE',
            'Nigeria' => 'NG',
            'Niue' => 'NU',
            'Norfolk Island' => 'NF',
            'Northern Mariana Islands' => 'MP',
            'Norway' => 'NO',
            'Oman' => 'OM',
            'Pakistan' => 'PK',
            'Palau' => 'PW',
            'Palestinian Territory, Occupied' => 'PS',
            'Panama' => 'PA',
            'Papua New Guinea' => 'PG',
            'Paraguay' => 'PY',
            'Peru' => 'PE',
            'Philippines' => 'PH',
            'Pitcairn' => 'PN',
            'Poland' => 'PL',
            'Portugal' => 'PT',
            'Puerto Rico' => 'PR',
            'Qatar' => 'QA',
            'Reunion' => 'RE',
            'Romania' => 'RO',
            'Russian Federation' => 'RU',
            'Rwanda' => 'RW',
            'Saint Barthelemy' => 'BL',
            'Saint Helena' => 'SH',
            'Saint Kitts And Nevis' => 'KN',
            'Saint Lucia' => 'LC',
            'Saint Martin' => 'MF',
            'Saint Pierre And Miquelon' => 'PM',
            'Saint Vincent And Grenadines' => 'VC',
            'St. Vincent and The Gren' => 'VC',
            'Samoa' => 'WS',
            'San Marino' => 'SM',
            'Sao Tome And Principe' => 'ST',
            'Saudi Arabia' => 'SA',
            'Senegal' => 'SN',
            'Serbia' => 'RS',
            'Seychelles' => 'SC',
            'Sierra Leone' => 'SL',
            'Singapore' => 'SG',
            'Slovakia' => 'SK',
            'Slovenia' => 'SI',
            'Solomon Islands' => 'SB',
            'Somalia' => 'SO',
            'South Africa' => 'ZA',
            'South Georgia And Sandwich Isl.' => 'GS',
            'Spain' => 'ES',
            'Sri Lanka' => 'LK',
            'Sudan' => 'SD',
            'Suriname' => 'SR',
            'Svalbard And Jan Mayen' => 'SJ',
            'Swaziland' => 'SZ',
            'Sweden' => 'SE',
            'Switzerland' => 'CH',
            'Syrian Arab Republic' => 'SY',
            'Taiwan' => 'TW',
            'Tajikistan' => 'TJ',
            'Tanzania' => 'TZ',
            'Thailand' => 'TH',
            'Timor-Leste' => 'TL',
            'Togo' => 'TG',
            'Tokelau' => 'TK',
            'Tonga' => 'TO',
            'Trinidad And Tobago' => 'TT',
            'Tunisia' => 'TN',
            'Turkey' => 'TR',
            'Turkmenistan' => 'TM',
            'Turks And Caicos Islands' => 'TC',
            'Tuvalu' => 'TV',
            'Uganda' => 'UG',
            'Ukraine' => 'UA',
            'United Arab Emirates' => 'AE',
            'United Kingdom' => 'GB',
            'United States' => 'US',
            'United States of America' => 'US',
            'United States Outlying Islands' => 'UM',
            'Uruguay' => 'UY',
            'Uzbekistan' => 'UZ',
            'Vanuatu' => 'VU',
            'Venezuela' => 'VE',
            'Viet Nam' => 'VN',
            'Virgin Islands, British' => 'VG',
            'Virgin Islands, U.S.' => 'VI',
            'Wallis And Futuna' => 'WF',
            'Western Sahara' => 'EH',
            'Yemen' => 'YE',
            'Zambia' => 'ZM',
            'Zimbabwe' => 'ZW'
        );
        if(!empty($country_hash[$country])){
            return $country_hash[$country];
        }else{
            throw new Exception('Could not find ISO 3166 country code of: ' . $country . '.');
        }
    }
}
/**
 * Get either a Gravatar URL or complete image tag for a specified email address.
 *
 * @param string $email The email address
 * @param string $s Size in pixels, defaults to 80px [ 1 - 2048 ]
 * @param string $d Default imageset to use [ 404 | mm | identicon | monsterid | wavatar ]
 * @param string $r Maximum rating (inclusive) [ g | pg | r | x ]
 * @param boole $img True to return a complete IMG tag False for just the URL
 * @param array $atts Optional, additional key/value attributes to include in the IMG tag
 * @return String containing either just a URL or a complete image tag
 * @source https://gravatar.com/site/implement/images/php/
 */
if(!function_exists('get_gravatar')){
    function get_gravatar( $email, $s = 80, $d = 'mm', $r = 'g', $img = false, $atts = array() ) {
        $url = 'https://www.gravatar.com/avatar/';
        $url .= md5( strtolower( trim( $email ) ) );
        $url .= "?s=$s&d=$d&r=$r";
        if ( $img ) {
            $url = '<img src="' . $url . '"';
            foreach ( $atts as $key => $val )
                $url .= ' ' . $key . '="' . $val . '"';
            $url .= ' />';
        }
        return $url;
    }
}