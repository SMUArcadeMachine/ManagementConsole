<?php
class Token extends REST_Controller
{
    public function __construct(){
        parent::__construct();
        require_once __DIR__ . '/../resources/oauth2-server-php/src/OAuth2/Autoloader.php';
    }
    public function index_get()
    {
//        q('BEGIN');
//        $api_key = $this->api_key();
//        $username = $this->post('username');
//        $password = $this->post('password');


        // Autoloading (composer is preferred, but for this example let's just do this)
        OAuth2\Autoloader::register();

        // $dsn is the Data Source Name for your database, for exmaple "mysql:dbname=my_oauth2_db;host=localhost"
        $storage = new OAuth2\Storage\Pdo(array('dsn' => 'mysql:dbname=' . MYSQL_DATABASE . ';host=' . MYSQL_HOST, 'username' => MYSQL_USERNAME, 'password' => MYSQL_PASSWORD));

        // Pass a storage object or array of storage objects to the OAuth2 server class
        $server = new OAuth2\Server($storage);

        // Add the "Client Credentials" grant type (it is the simplest of the grant types)
        $server->addGrantType(new OAuth2\GrantType\ClientCredentials($storage));

        $server->handleTokenRequest(OAuth2\Request::createFromGlobals())->send();

    }
}