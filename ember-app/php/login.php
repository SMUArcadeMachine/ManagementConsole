<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/20/2016
 * Time: 1:01 AM
 */
$servername = "localhost";
$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sqlquery = 'SELECT * FROM users WHERE smuid="' . $_POST['smuid'] . '";';
        $result = $conn->query($sqlquery);

        if (count($result) > 0){
            if (password_verify($_POST['password'], $result[0]['password']) == false) {
                echo "Login failed - password doesn't match";
                return json_encode(array('status' => '0'));
            } else {
                setcookie('login', 'true'/*$temp[0]['activationKey']*/, time() + 900);
                return json_encode(array('status' => '1')); //, 'user' => array('smuid' => $_POST['username'], 'email' => $result[0]['email'])));
#					return $response->withStatus(301)->withHeader('Location','/landing');
            }
        } else { //no response from DB
            echo "No results from Login request";
            return json_encode(array('status' => 'no'));
        }
    }
    catch(PDOException $e){
        echo $sqlquery."<br>".$e->getMessage();
        return json_encode(array('status' => '0'));
    }
}

