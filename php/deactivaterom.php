<?php
/**
 * Created by PhpStorm.
 * User: claylewis
 */

// Connect to the database
$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";

$db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

// Get the roms to be activated
$roms = file_get_contents('php://input');
//echo var_dump($_POST);
//echo "We receive: ".$roms;
$roms = json_decode($roms);
$roms = $roms->games;
//echo $roms;
$res = array();
foreach($roms as $rom){
    echo $rom->title;
    // Get the file location and name
    $stmt = $db->prepare("SELECT file_name FROM roms WHERE game_name = ?");
    $stmt->execute(array($rom->title));
    $romRecord = $stmt->fetch(PDO::FETCH_ASSOC);
    $fileName = $romRecord["file_name"];
    echo var_dump($romRecord);
    echo var_dump($fileName);
    // Unhide the file
    $res[0] = rename("/home/pi/RetroPie/roms/mame-mame4all/$fileName", "/home/pi/gamestorage/$fileName");
    $stmt = $db->prepare("UPDATE roms SET rom_active = 0 WHERE game_name = ?");
    $res[1] = $stmt->execute(array($rom->title));
}
$res = json_encode($res);
echo $res;
