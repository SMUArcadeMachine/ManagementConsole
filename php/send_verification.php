<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/27/2016
 * Time: 12:49 AM
 */
$servername = "localhost";
$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";

function redirect($url, $statusCode = 303)
{
    header('Location: ' . $url, true, $statusCode);
    die();
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $temp = $conn->prepare('SELECT username FROM users WHERE activationKey="' . $_GET['activationKey'] . '";');
        $temp->execute();
        $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

        if ($temp) {
            $user = $temp[0]['username'];
            $temp = $conn->prepare('UPDATE users SET verified=1 WHERE username="' . $user . '";');
            $temp->execute();
            echo "Verified";
        } else {
            redirect('/login'); //missing url
        }
    } catch (PDOException $e) {
        echo $sqlquery . "<br>" . $e->getMessage();
        echo json_encode(array('success' => 'no'));
    }
}