<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/27/2016
 * Time: 8:23 AM
 */

public function toDateTime($unixTimestamp){
    return date("Y-m-d H:m:s", $unixTimestamp);
}

$servername = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";


$reg = array(
    'start' => "/(START)/i",
    'end' => "/(END)/i",
    'time_end' => "/(?:(END)\_)(\d+)/i",
    'game_name' => "/(?:(END)\_(\d+)\_).+/i",         //(?:(\_{1}\d+\_{1}))(\w+\s)+/",
    'time_start' => "/(?:(START)\_)(\d+)/i"
);


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $line = $_POST['log'];

    if (preg_match($reg['start'], $line, $matches)) {
        $time_start = preg_match($reg['time_played'], $line, $matches);

    } else if (preg_match($reg['time_end'], $line, $matches)) {
        $time_end = preg_match($reg['time_end'], $line, $matches);
        $game_name = preg_match($reg['game_name'], $line, $matches);

        $time_startSQL = toDateTime($time_start);
        $time_endSQL = toDateTime($time_end);
        $time_playedSQL = $time_startSQL - $time_endSQL;

        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sqlquery = 'SELECT * FROM game_data WHERE game_name="' . $game_name . '";';
            $temp = $conn->prepare($sqlquery);
            $temp->execute();
            $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

            if (count($temp) > 0) {
                $sqlquery = 'INSERT INTO game_data (time_start,time_end,time_played,game_name,counts) VALUES ("' . $time_startSQL . '","' . $time_endSQL . '","' . $time_playedSQL . '","' . $game_name . '", 1;';
                $temp = $conn->prepare($sqlquery);
                $temp->execute();
                $temp = $temp->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $sqlquery = 'UPDATE game_data SET time_start ="' . $time_startSQL . '", AND time_end="' . $time_endSQL . '", AND time_played = time_played+"' . $time_playedSQL . '", AND counts = counts+1 WHERE game_name ="' . $game_name . '";';
                $temp = $conn->prepare($sqlquery);
                $temp->execute();
                $temp = $temp->fetchAll(PDO::FETCH_ASSOC);
            }
            echo json_encode(array('success' => 'yes'));

        } catch (PDOException $e) {
            echo $sqlquery . "<br>" . $e->getMessage();
        }
    } else {
        echo "Error with parsing game data";
    }

}

if ($_SERVER["REQUEST_METHOD"] == "GET") {

   $getgame_name = $_GET['game_name'];

    try {

        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sqlquery = 'SELECT * FROM game_data WHERE game_name="' . $game_name . '";';
        $temp = $conn->prepare($sqlquery);
        $temp->execute();
        $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

        if($temp > 0){
            echo json_encode(array('game_name' => $temp['game_name'], 'time_played' => $temp['time_played']));
        }else{
            echo json_encode(array('success' => 'no'));
        }

    }catch (PDOException $e) {
        echo $sqlquery . "<br>" . $e->getMessage();
    }

}