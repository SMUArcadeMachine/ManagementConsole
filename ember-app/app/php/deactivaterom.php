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

// Get the roms to be deactivated
$roms = $_GET["games"];
$roms = json_decode($roms);
$roms = $roms["deactivate"];

// Connect to the game pi with ssh

foreach($roms as $rom){
    // Get the file location and name
    $stmt = $db->prepare("SELECT file_name FROM roms WHERE game_name = ?");
    $stmt->execute(array($rom["title"]));
    $romRecord = $stmt->fetch(PDO::FETCH_ASSOC);
    $fileName = $romRecord["file_name"];

    // Unhide the file
    rename("/home/pi/RetroPie/roms/mame-mame4all/{$fileName}", "/home/pi/gamestorage/{$fileName}");
    $stmt = $db->prepare("UPDATE roms SET rom_active = 0 WHERE game_name = ?");
    $stmt->execute(array($rom["title"]));
}

echo 1;