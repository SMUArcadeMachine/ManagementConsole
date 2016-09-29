<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/27/2016
 * Time: 1:07 AM
 */

$servername = "localhost";
$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";


//checks if tcorrect request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //$parsedReq = $request->getParsedBody();
    $recoveryKey = sha1(mt_rand(10000, 99999) . time() . $_POST['email']);

    // Attempt DB connection
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $temp = $conn->prepare('SELECT * FROM users WHERE email="' . $_POST['email'] . '";');
        $temp->execute();
        $temp = $temp->fetchAll(PDO::FETCH_ASSOC);
        $user = $temp[0]['username'];
        //Mail protocol - need ip
        /*
        $mailHeaders = array(
            'From' => 'arcademachineinc@gmail.com',
            'To' => $_POST['email'],
            'Subject' => 'Email Password Reset',
            'Content-type' => 'text/html;charset=iso-8859-1'
        );
        $smtp = @Mail::factory('smtp', array(
            'host' => 'ssl://smtp.gmail.com',
            'port' => '465',
            'auth' => true,
            'username' => 'arcademachineinc@gmail.com',
            'password' => 'ballers007'
        ));

        $mail = @$smtp->send($_POST['email'], $mailHeaders, '<html><a href="http:// ip /recovery/' . $recoveryKey . '">Click here to reset your password</a></html>'); //need ip
        */
        $temp = $conn->prepare('INSERT INTO recovery values("' . $recoveryKey . '","' . $user . '");');
        $temp->execute();

    }catch (PDOException $e) {
        echo $sqlquery . "<br>" . $e->getMessage();
        echo json_encode(array('success' => 'no'));
    }

}


function redirect($url, $statusCode = 303)
{
    header('Location: ' . $url, true, $statusCode);
    die();
}