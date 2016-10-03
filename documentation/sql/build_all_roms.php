<?php
/**
 * Created by PhpStorm.
 * User: claylewis
 */

function cleanName($name){
    $pos = strpos($name, "(");
    if($pos == FALSE){
        return $name;
    }
    $name = substr($name, 0, $pos);
    return $name;
}

function getInfo($name){
    $url =  "http://thegamesdb.net/api/GetGame.php?name=$name";
    $fileContents= file_get_contents($url);
    $fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
    $fileContents = trim(str_replace('"', "'", $fileContents));
    $simpleXml = simplexml_load_string($fileContents);
    $json = json_encode($simpleXml);
    $json = json_decode($json);
    $baseUrl = $json->baseImgUrl;
    $art = $json->Game;
    $desc = $art[0]->Overview;
    $theimg =  $art[0]->Images->boxart;
    $imgUrl = $baseUrl.$theimg;

    return array($imgUrl, $desc);
}


$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";

$db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

$romNames = fopen("rom_names.txt", "r");

// Get all the rom files and they're names
while(! feof($romNames)) {
        $line = fgets($romNames);
        $line = preg_split('/[\t]/', $line);
        $file = $line[0] . ".zip";
        $name = rtrim(cleanName($line[1]));
        $info = getInfo($name);
        $imgUrl = $info[0];
        $desc = $info[1];


        $stmt = $db->prepare("INSERT INTO possible_roms (file_name, game_name, image_loc, game_desc) VALUES (?, ?, ?, ?)");
        $stmt->bindParam(1, $file);
        $stmt->bindParam(2, $name);
        $stmt->bindParam(3, $imgUrl);
        $stmt->bindParam(4, $desc);
        $stmt->execute();
}

fclose($romNames);