<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/26/2016
 * Time: 10:56 PM
 */

$reg= array( //regex to satisfy constrains
    'user' => "/[a-zA-Z0-9-]{1,40}/",
    'name' => "/[a-zA-Z0-9]{1,20}/",
    'email' => "/^([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/",
    'pass' =>  "/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&'])[^ ]{8,}$/",
    'admin' => "/[0-1]{1}/"
);

$servername = "localhost";
$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if($parsedReq['email']==$parsedReq['reemail']) {
        $emailValid = preg_match($reg['email'],$_POST['email']);
        $firstValid = preg_match($reg['name'],$_POST['name']);
        $lastValid = preg_match($reg['last'],$_POST['last']);
        $userValid = preg_match($reg['user'],$_POST['username']);
        $adminValid = preg_match($reg['admin'],$_POST['admin']);

        //Ceck if all fields match criteria
        if($emailValid && $userValid && $firstValid && $lastValid && $adminValid) {
            //attempt DB connection
            try {
                $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sqlquery = 'SELECT * FROM users WHERE username="' . $_POST['username'] . '" OR email="' . $_POST['email'] . '";';

                $temp = $conn->prepare($sqlquery);
                $temp->execute();
                $temp = $temp->fetchAll(PDO::FETCH_ASSOC);
                $passExp = "/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&'])[^ ]{8,}$/";
                $passValid = TRUE; #preg_match($expression,$parsedReq['password']);
                //$result = $conn->query($sqlquery);

                if (count($temp) != 0) {
                    echo "That username or email already exists!";
                } else if ($passValid && $userValid) {
                    $activationKey = sha1(mt_rand(10000, 99999) . time() . $_POST['email']);
                    setcookie('login', $activationKey, 90);
                    $hashedpw = password_hash($_POST['password'], PASSWORD_DEFAULT); //hashed password produced
                    $temp = $conn->prepare('INSERT INTO users (username,firstName,lastName,email,admin,password,dateCreated,verified,activationKey) VALUES ("' . $_POST['username'] . '","' . $_POST['first'] . '","' . $_POST['last'] . '","' . $_POST['email'] . '","' . $_POST['admin'] . '","' . $hashedpw . '", CURDATE(),0,"' . $activationKey . '");');
                    $temp->execute();

                    //mail protocol
                    /*
                    $mailHeaders = array(
                        'From' => 'arcademachineinc@gmail.com', // need email
                        'To' => $_POST['email'],
                        'Subject' => 'Email Verification -- ArcadeMachineInc',
                        'Content-type' => 'text/html;charset=iso-8859-1'
                    );
                    $smtp = @Mail::factory('smtp', array(
                        'host' => 'ssl://smtp.gmail.com',
                        'port' => '465',
                        'auth' => true,
                        'username' => 'arcademachineinc@gmail.com',
                        'password' => 'ballers007'
                    ));

                    $mail = @$smtp->send($_POST['email'], $mailHeaders, '<html><a href="http:// ip /verify/' . $activationKey . '">Click here to verify!</a></html>');  //need ip
                    echo json_encode(array('success' => 'yes'));*/

                    //if there are no matches
                } else if (!$_POST) {
                    echo "Password does not meet requirements!";
                }}
            //If DB connection fails
            catch (PDOException $e) {
                echo $sqlquery . "<br>" . $e->getMessage();
                echo json_encode(array('success' => 'no'));
            }
        }
        //if something doesn't match criteria
        else {
            echo 'regex';
            #return $response->withJson(array('success'=>'no'));
        }
    }
    else {
        echo json_encode(array('success'=>'no'));
        }
        #return $response->withStatus(301)->withHeader('Location','/home');
}

