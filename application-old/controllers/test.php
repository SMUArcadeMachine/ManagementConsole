<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Test extends CI_Controller   {
    public function index_get(){
        echo 'Controller: Test' . "\n";
        echo '<br>';
        echo 'Method: Index';
        echo '<br>';
        echo 'Request Type: GET';
        echo '<br>';
        echo 'Response coming from: application/controllers/test.php<br>';

        echo 'Sample JSON:<br>';

        echo json_encode(array(
            'user' => array(
                'id' => 1,
                'name' => 'Bob'
            )
        ));
    }
}



