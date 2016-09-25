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

$db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4, $username, $password");

// Get the roms to be deactivated
$roms = $_GET["games"];
$roms = json_decode($roms);
$roms = $roms["deactivate"];

// Connect to the game pi with ssh
$connection = ssh2_connect('The Other Pi Address', 22);
ssh2_auth_password($connection, 'pi', 'raspberry');
$sftp = ssh2_sftp($connection);


foreach($roms as $rom){
    // Get the file location and name
    $stmt = $db->prepare("SELECT Gamename FROM Games WHERE Gamename == ?");
    $stmt->execute(array($rom["title"]));
    $romRecord = $stmt->fetch(PDO::FETCH_ASSOC);
    $fileLoc = $romRecord["GameRomLoc"];
    $fileName = substr(strrchr($fileLoc, "/"), 1);
    $newName = ".".$fileName;

    // Hide the file
    ssh2_sftp_rename($sftp, "/home/pi/RetroPie/roms/MAMEVERSION/{$fileName}", "/home/pi/RetroPie/roms/MAMEVERSION/{$newName}");
    $stmt = $db->prepare("UPDATE Games SET GameActive = 0 WHERE Gamename = ?");
    $stmt->execute(array($rom["title"]));
}

echo 1;