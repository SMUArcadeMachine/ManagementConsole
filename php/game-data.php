<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/27/2016
 * Time: 8:23 AM
 */

$servername = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";


$reg = array(
    'start' => "/(S)+(T)+(A)+(R)+(T)/i",
    'end' => "/(E)+(N)+(D)/",
    'time_end' => "/(?:(END)\_)(\d+)/i",
    'game_name' => "/(?:(END)\_(\d+)\_).+/i",         //(?:(\_{1}\d+\_{1}))(\w+\s)+/",
    'time_start' => "/(?:(START)\_)(\d+)/i"
);


$myfile = fopen("filename.txt", "r") or die("Unable to open file");

while(!feof($myfile)) {
    $line = fgets($myfile) . "<br />";

    if (preg_match($reg['time_start'], $line, $matches)) {
        $time_start = preg_match($reg['time_played'], $line, $matches);
    } else if (preg_match($reg['time_end'], $line, $matches)) {
        $time_end = preg_match($reg['time_end'], $line, $matches);
        $game_name = preg_match($reg['game_name'], $line, $matches);

        $time_startSQL = toDateTime($time_start);
        $time_endSQL = toDateTime($time_end);
        $time_playedSQL = $time_startSQL - $time_endSQL;


        $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
        //store in db
        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
            $temp = $conn->prepare($sqlquery);
            $temp->execute();
            $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

            if (count($temp) > 0) {
                $sqlquery = 'INSERT INTO gameData (timeStart,timeEnd,timePlayed,gameName,counts) VALUES ("' . $time_startSQL . '","' . $time_endSQL . '","' . $time_playedSQL . '","' . $game_name . '", 1;';
                $temp = $conn->prepare($sqlquery);
                $temp->execute();
                $temp = $temp->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $sqlquery = 'UPDATE gameData SET timeStart ="' . $time_startSQL . '", AND timeEnd="' . $time_endSQL . '", AND timePlayed = timePlayed+"' . $time_playedSQL . '", AND counts = counts+1 WHERE gameName ="' . $game_name . '";';
                $temp = $conn->prepare($sqlquery);
                $temp->execute();
                $temp = $temp->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            echo $sqlquery . "<br>" . $e->getMessage();
        }
    } else {
        echo "Error with parsing game data";
    }
}
fclose($myfile);


public function toDateTime($unixTimestamp){
    return date("Y-m-d H:m:s", $unixTimestamp);
}
