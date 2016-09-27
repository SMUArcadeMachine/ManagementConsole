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
        $sqlquery = 'SELECT * FROM users WHERE username="' . $_POST['username'] . '";';
        $result = $conn->query($sqlquery);

        if ($result->num_rows > 0) {
            if (password_verify($_POST['password'], $result[0]['password']) == false) {

                echo "Login failed - password doesn't match";
                echo json_encode(array('success' => 'no'));
            } else {
                setcookie('login', 'true'/*$temp[0]['activationKey']*/, time() + 90);
                echo json_encode(array('success' => 'yes', 'username' => $_POST['username'], 'email' => $result[0]['email']));
#					return $response->withStatus(301)->withHeader('Location','/landing');
            }
        } else { //no response from DB
            echo "No results from Login request";
            echo json_encode(array('success' => 'no'));
        }

    }
    catch(PDOException $e){
        echo $sqlquery."<br>".$e->getMessage();
        echo json_encode(array('success' => 'no'));
    }
}

