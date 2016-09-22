<?php
/**
 * Created by PhpStorm.
 * User: claylewis

 */

$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";

$db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4, $username, $password");
$roms = array();

foreach($db->query("SELECT Gamename FROM Games WHERE active == 0") as $row) {
    $game = array("title" => $row['Gamename']);
    array_push($roms, $game);
}

$response = array("roms" => $roms);
$response = json_encode($response);

echo $response;