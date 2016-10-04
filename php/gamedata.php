<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/27/2016
 * Time: 8:23 AM
 */


ini_set('display_errors',1);

$servername = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";

//regex for scraping Software Team's data
$reg = array(
    'start' => "/(START)/i",
    'end' => "/(END)/i",
    'time_end' => "/(\d){11}/", //"/(?:((END)\_))(\d+)/i",
    'game_name' => "/(\d){11}(\_)(\w+)/",// "/(?=(END\_(\d+)(\_)))(\w)+/",         //(?:(\_{1}\d+\_{1}))(\w+\s)+/",
    'time_start' => "/(?:(START)\_)(\d+)/i"//,
    // 'restart' => "/?:(RESTART)"
);
$time_start;
$matches=array();

//Data coming from software
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $line = $_POST['postVariable'];
    global $time_start;
    preg_match($reg['start'], $line, $matches);

    //checks for regex hits
    if (!empty($matches)){
        //"START" case
        if( $matches[0] == "START" || $matches[0] == "start") {
            preg_match($reg['time_start'], $line, $matches);
            $time_start = $matches[2];

            //make a temp file to store start time
            $myfile = fopen("temp_buffer.txt", "w") or die("Unable to open buffer file!");
            fwrite($myfile, $matches[2]);
            fclose($myfile);
        }
        //"END" case
    } else {
        preg_match($reg['end'], $line, $matches);
        if ($matches[0] == "END" || $matches == "end") {
            preg_match($reg['time_end'], $line, $matches);
            $time_end = $matches[0];
            preg_match($reg['game_name'], $line, $matches);
            $game_name = $matches[3];

            //get start time from temp file
            $myfile = fopen("temp_buffer.txt", "r") or die ("Can't open buffer file");
            $time_start = fgets($myfile);
            fclose($myfile);
            $pathtofile = "/var/www/html/php/temp_buffer.txt";
            unlink($pathtofile);
            $time_played = $time_end - $time_start;

            //connect DB
            try {
                $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
                $temp = $conn->prepare($sqlquery);
                $temp->execute();
                $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

                //if the game is not in the DB yet, new entry
                if (!(count($temp) > 0)) {
                    $sqlquery = 'INSERT INTO gameData (timeStart,timeEnd,timePlayed,gameName,counts) VALUES ("' . $time_start . '","' . $time_end . '","' . $time_played . '","' . $game_name . '", 1);';
                    $temp = $conn->prepare($sqlquery);
                    $temp->execute();

                    //if the game is already in the DB, update fields
                } else if(count($temp)>0){
		            $tplayed = $temp[0]['timePlayed'];
		            $tplayed = $tplayed + $time_played;
		            $cnt = $temp[0]['counts'] + 1;
                    $sqlquery = 'UPDATE gameData SET timeStart="' . $time_start . '", timeEnd="' . $time_end . '", timePlayed ="'. $tplayed.'", counts ="'.$cnt.'"  WHERE gameName ="' . $game_name . '";';
                    $temp = $conn->prepare($sqlquery);
                    $temp->execute();
                }
                //report success
                echo json_encode(array('success' => 'yes'));
            } catch (PDOException $e) {
                echo $sqlquery . "<br>" . $e->getMessage();
            }
        } else {
            echo "Error with parsing game data";
        }


    }
}

//process GET request from frontend
if ($_SERVER["REQUEST_METHOD"] == "GET") {

    //checks ig gameName parameter is set
   if(!isset($_GET['gameName'])) {
       try {
           $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
           $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
           $sqlquery = 'SELECT * FROM gameData;';
           $temp = $conn->prepare($sqlquery);
           $temp->execute();
           $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

           if($temp > 0){
               $tempArray = array('usage'=>array());
               $usage = array();
               $ar = array();
               $count =0;
               //$tempArray[] = 'usage'array();
               for($t = 0; $t<sizeof($temp); $t++) {
                    array_push($tempArray,array( 'title'=>$temp[$t]['gameName'], 'plays'=>$temp[$t]['counts']));

               }
               echo json_encode($tempArray);//array('gameName' => $temp[0]['gameName'], 'timePlayed' => $temp[0]['timePlayed'], 'timesPlayed' => $temp[0]['counts']));
           }else{
               echo json_encode(array('success' => 'no'));
           }

       }catch (PDOException $e) {
           echo $sqlquery . "<br>" . $e->getMessage();
       }


       //if it is, query database
    }else{
    $getGameName = $_GET['gameName'];

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $getGameName . '";';
        $temp = $conn->prepare($sqlquery);
        $temp->execute();
        $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

        if($temp > 0){
            echo json_encode(array('gameName' => $temp[0]['gameName'], 'timePlayed' => $temp[0]['timePlayed'], 'timesPlayed' => $temp[0]['counts']));
        }else{
            echo json_encode(array('success' => 'no'));
        }

    }catch (PDOException $e) {
        echo $sqlquery . "<br>" . $e->getMessage();
    }
}
}
