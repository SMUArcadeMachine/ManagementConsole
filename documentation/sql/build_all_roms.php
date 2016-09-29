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


        $stmt = $db->prepare("INSERT INTO possible_roms (file_name, game_name) VALUES (?, ?)");
        $stmt->bindParam(1, $file);
        $stmt->bindParam(2, $name);
        $file = $line[0] . ".zip";
        $name = rtrim(cleanName($line[1]));
        $stmt->execute();
}

fclose($romNames);