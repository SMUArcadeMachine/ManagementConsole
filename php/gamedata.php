<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/27/2016
 * Time: 8:23 AM
 */

/*public function toDateTime($unixTimestamp){
    return date("Y-m-d H:m:s", $unixTimestamp);
}*/

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


       //$sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
        //store in db
        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
            $temp = $conn->prepare($sqlquery);
            $temp->execute();

            if(empty($temp)){
                $query = "CREATE TABLE gameData(
                          timeStart TIME,
                          timeEnd TIME,
                          timePlayed TIME,
                          gameName VARCHAR(50),
                          counts int(3000)
                )";
                $temp = $conn->prepare($query);
                $temp->execute();

                $temp = $conn->prepare($sqlquery);
                $temp->execute();
            }
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
            echo json_encode(array('success' => 'yes'));

        } catch (PDOException $e) {
            echo $sqlquery . "<br>" . $e->getMessage();
        }
    } else {
        echo "Error with parsing game data";
    }

}

if ($_SERVER["REQUEST_METHOD"] == "GET") {

   $getGameName = $_GET['gameName'];

    try {

        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
        $temp = $conn->prepare($sqlquery);
        $temp->execute();
        $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

        if($temp > 0){
            echo json_encode(array('gameName' => $temp['gameName'], 'timePlayed' => $temp['timePlayed'], 'timesPlayed' => $temp['counts']));
        }else{
            echo json_encode(array('success' => 'no'));
        }

    }catch (PDOException $e) {
        echo $sqlquery . "<br>" . $e->getMessage();
    }

}