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
    'admin' => "/[1-2]{1}/"
);

$servername = "localhost";
$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //if($_POST['email']==$_POST['reemail']) {
        $emailValid = preg_match($reg['smuemail'],$_POST['smuemail']);
        //$firstValid = preg_match($reg['name'],$_POST['name']);
        //$lastValid = preg_match($reg['last'],$_POST['last']);
        //$userValid = preg_match($reg['user'],$_POST['username']);
        $usertypeValid = preg_match($reg['usertype'],$_POST['usertype']);

        //Ceck if all fields match criteria
        if($emailValid && $usertypeValid){  //$userValid && $firstValid && $lastValid && $usertype) {
            //attempt DB connection
            try {
                $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sqlquery = 'SELECT * FROM users WHERE username="' . $_POST['smuid'] . '" OR email="' . $_POST['smuemail'] . '";';

                $temp = $conn->prepare($sqlquery);
                $temp->execute();
                $temp = $temp->fetchAll(PDO::FETCH_ASSOC);
                $passExp = "/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&'])[^ ]{8,}$/";
                $passValid = TRUE; #preg_match($expression,$parsedReq['password']);
                //$result = $conn->query($sqlquery);

                if (count($temp) != 0) {
                    echo "User with this email already exists!";
                    return json_encode(array('status' => '0'));

                } else if ($passValid) {
                    $activationKey = sha1(mt_rand(10000, 99999) . time() . $_POST['smuemail']);
                    setcookie('login', $activationKey, 900);
                    $hashedpw = password_hash($_POST['password'], PASSWORD_DEFAULT); //hashed password produced
                    $temp = $conn->prepare('INSERT INTO users (smuemail,usertype,password,dateCreated,verified,activationKey) VALUES ("' . $_POST['smuemail'] . '","' . $_POST['usertype'] . '","' . $hashedpw .  '",", CURDATE(),0,","' . $activationKey . '");');
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
                    return json_encode(array('ststus' => '1'));
                } else if (!$_POST) {
                    echo "Password does not meet requirements!";
                    return json_encode(array('status' => '0'));
                }}
            //If DB connection fails
            catch (PDOException $e) {
                echo $sqlquery . "<br>" . $e->getMessage();
                return json_encode(array('status' => '0'));
            }
        }
        //if something doesn't match criteria
        else {
            echo 'regex fail';
            return json_encode(array('status' => '0'));
            #return $response->withJson(array('success'=>'no'));
        }
    /*}
    else {
        return json_encode(array('success'=>'no'));
    }*/
        #return $response->withStatus(301)->withHeader('Location','/home');
}
else{
    return json_encode(array('status' => '0'));
}

