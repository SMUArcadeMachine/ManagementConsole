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

$roms = $_POST['games'];
$res = array();
foreach($roms as $rom){
    // Get the file location and name
    $fileName = "unset";
    $gameName = $rom['title'];
    try {
        $stmt = $db->prepare("SELECT file_name FROM roms WHERE game_name = ?");
        $stmt->execute(array($rom['title']));
        $romRecord = $stmt->fetch(PDO::FETCH_ASSOC);
        $fileName = $romRecord["file_name"];
    } catch (PDOException $e) {
        echo "Error getting the file name for $gameName: " . $e->getMessage();
    }

    // Move the file
    $res[0] = rename("/home/pi/RetroPie/roms/mame-mame4all/$fileName", "/home/pi/gamestorage/$fileName");
    if($res[0] == FALSE){
        echo "Error moving the $fileName file, please check permissions.";
    }

    //Update the DB
    try {
        $stmt = $db->prepare("UPDATE roms SET rom_active = 0 WHERE game_name = ?");
        $res[1] = $stmt->execute(array($rom['title']));
    } catch (PDOException $e) {
        echo 'Error updating the database for $gameName: ' . $e->getMessage();
    }

}


$res = json_encode($res);
echo $res;
