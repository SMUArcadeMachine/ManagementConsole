<?php
/**
 * Created by PhpStorm.
 * User: claylewis
 * Date: 9/14/16
 * Time: 6:00 PM
 */

include  'SFTPConnection.php';

// Create configuration file. The format is "filename.zip.cfg"
$cfgFile = fopen($_POST['romFileName'].'.cfg', 'x');

// Array with the controls, allows to write to the file using loops
$controls = array("up", "down", "left", "right", "a", "b", "y", "x", "l", "r");

// Write the controls to file
// example of a line in the configuration file: "input_player1_a = alt"
for ($x = 1; $x <= 2; $x++){
    foreach ($controls as $y) {
        fwrite($cfgFile, "input_player{$x}_{$y} = ".$_POST["p{$x}{$y}"] . '\n');
    }
}

fclose($cfgFile);

// Send the file using the SFTP class
try
{
    $sftp = new SFTPConnection("The Other Pi's address", 22);           // Need to find out what this is!
    $sftp->login("pi", "raspberry");                                    // Need to find out if they changed this
    $sftp->uploadFile($cfgFile, "/home/pi/RetroPie/roms/MAMEVERSION");  // Still need to figure our MAME version
}
catch (Exception $e)
{
    echo $e->getMessage() . "\n";
}

delete($cfgFile)

?>