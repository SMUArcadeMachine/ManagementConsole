<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 10/3/2016
 * Time: 9:28 PM
 */

ini_set('display_errors',1);

$servername = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if($_POST['title']){
        $game = $_POST['title'];

        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sqlquery = 'DELETE FROM gameData WHERE gameName="' . $game . '";';
            $temp = $conn->prepare($sqlquery);

            if($temp->execute() == TRUE){
                echo json_encode(array('success' => 'yes'));
            }else{
                echo json_encode(array('success' => 'no'));
            }

        }catch (PDOException $e) {
            echo $sqlquery . "<br>" . $e->getMessage();
        }

    }else{
        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sqlquery = 'DELETE * FROM gameData;';
            $temp = $conn->prepare($sqlquery);

            if($temp->execute() == TRUE){
                echo json_encode(array('success' => 'yes'));
            }else{
                echo json_encode(array('success' => 'no'));
            }

        }catch (PDOException $e) {
            echo $sqlquery . "<br>" . $e->getMessage();
        }
    }



}