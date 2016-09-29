<?php
/**
 * Created by PhpStorm.
 * User: claylewis
 */



$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";

$db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

function getName($file, $db){
    $name = $db->query("SELECT game_name FROM possible_roms WHERE file_name == $file");
    return $name[game_name];
}

$activeDir = scandir("/home/pi/RetroPie/roms/mame-mame4all");
$aDir = "/home/pi/RetroPie/roms/mame-mame4all/";
$inactiveDir = scandir("/home/pi/gamestorage");
$uDir = "/home/pi/gamestorage/";

$a = 1;
$u = 0;

if(count($activeDir) > 1) {
    for ($x = 2; $x < count($activeDir); $x++) {
        if(strpos($activeDir[$x], '.zip') !== false){
            $gName = getName($activeDir[$x], $db);
            $stmt = $db->prepare("INSERT INTO possible_roms (game_name, file_name, rom_loc, rom_active) VALUES (?, ?, ?, ?)");
            $stmt->bindParam(1, $gName);
            $stmt->bindParam(2, $activeDir[$x]);
            $stmt->bindParam(3, $aDir);
            $stmt->bindParam(4, $u);
            $stmt->execute();

        }
    }
}

if(count($inactiveDir) > 1) {
    for ($x = 2; $x < count($inactiveDir); $x++) {
        if(strpos($inactiveDir[$x], '.zip') !== false){
            $gName = getName($inactiveDir[$x], $db);
            $stmt = $db->prepare("INSERT INTO possible_roms (game_name, file_name, rom_loc, rom_active) VALUES (?, ?, ?, ?)");
            $stmt->bindParam(1, $gName);
            $stmt->bindParam(2, $inactiveDir[$x]);
            $stmt->bindParam(3, $uDir);
            $stmt->bindParam(4, $u);
            $stmt->execute();

        }
    }
}