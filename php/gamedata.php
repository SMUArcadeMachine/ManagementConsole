<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/27/2016
 * Time: 8:23 AM
 */

/*public function toDateTime($unixTimestamp){
    return date("Y-m-d H:m:s", $unixTimestamp);
}*/
ini_set('display_errors',1);

$servername = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";
//Semaphore definitions to prevent restarting while a game runs
    //Reference to semaphore http://www.re-cycledair.com/php-dark-arts-semaphores
//$MEMSIZE = 512;
//$SEMKEY = 1;
//$SHMKEY = 2;
//$sem_id = sem_get(SEM_KEY, 1, 0666, 1);

$reg = array(
    'start' => "/(START)/i",
    'end' => "/(END)/i",
    'time_end' => "/(?:(END)\_)(\d+)/i",
    'game_name' => "/(?:(END)\_(\d+)\_).+/i",         //(?:(\_{1}\d+\_{1}))(\w+\s)+/",
    'time_start' => "/(?:(START)\_)(\d+)/i"//,
   // 'restart' => "/?:(RESTART)"
);
$time_start;

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $line = $_POST['postVariable'];
    global $time_start;
    preg_match($reg['start'], $line, $matches)
	    echo $matches[0];
    if ($matches[0] == "START")) {
	  //  if(sem_acquire($sem_id)){ //set the semaphore here so we can't restart the Pi until the game is closed
        $time_start = preg_match($reg['time_start'], $line, $matches);
	$myfile = fopen("temp_buffer.txt", "w") or die("Unable to open buffer file!");
	fwrite($myfile, $matches[0]);
	fclose($myfile);
	/*try {
		 $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		 $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		 $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
		 $temp = $conn->prepare($sqlquery);
		 $temp->execute();
		 $temp = $temp->fetchAll(PDO::FETCH_ASSOC);
	
	    if (!(count($temp) > 0)) {
			$sqlquery = 'INSERT INTO gameData (timeStart) VALUES ("' . $time_start . '";';
			$temp = $conn->prepare($sqlquery);
			$temp->execute();
			$temp = $temp->fetchAll(PDO::FETCH_ASSOC);
		    } else {
			$sqlquery = 'UPDATE gameData SET timeStart ="' . $time_startSQL . '";';
			$temp = $conn->prepare($sqlquery);
			$temp->execute();
			$temp = $temp->fetchAll(PDO::FETCH_ASSOC);
		    }
            echo json_encode(array('success' => 'yes'));
		//sem_release($sem_id); //We release the semaphore so that a restart can run if needed
        } catch (PDOException $e) {
            echo $sqlquery . "<br>" . $e->getMessage();
		//sem_release($sem_id); //We release the semaphore so that a restart can run if needed
        }*/
	    
//	}
    } else {
	preg_match($reg['end'], $line, $matches)
		echo $matches;
    	if ($matches[0] == "END") {
		preg_match($reg['time_end'], $line, $matches);
		$time_end = $matches[0];
		preg_match($reg['game_name'], $line, $matches);
		$game_name = $matches[0];
		echo $matches;
		
		$myfile = fopen("temp_buffer.txt", "r") or die ("Can't open buffer file");
		$time_start = fgets($myfile);
		fclose($myfile);
		unlink($myfile);
		$time_played = $time_end - $time_start;
		//$time_startSQL = date('H:i:s', $time_start);
		//$time_endSQL = date('H:i:s', $time_end);
		//echo $time_start;
		//$time_playedSQL = $time_end - $time_start;

   /* else if($_POST['restart']) { //If we see the restart value in the POST data, we will restart
   // else if(preg_match($reg['restart'],$line,$matches)) { //This looks for for restart pushed from the machine software side, to better integrate with gamedata.php current functionality.
	if( sem_acquire($sem_id)){
	shell_exec("sudo /sbin/shutdown -r +1");
	
	sem_release($sem_id);
	echo "Releasing semaphore";
	}*/
       //$sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
		
        //update db when received END
		try {
		    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		    $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
		    $temp = $conn->prepare($sqlquery);
		    $temp->execute();
		    $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

		    if (!(count($temp) > 0)) {
			$sqlquery = 'INSERT INTO gameData (timeStart,timeEnd,timePlayed,gameName,counts) VALUES ("'.$time_start.'","'. $time_end . '","' . $time_played . '","' . $game_name . '", 1;';
			$temp = $conn->prepare($sqlquery);
			$temp->execute();
			$temp = $temp->fetchAll(PDO::FETCH_ASSOC);
		    } else {
			$sqlquery = 'UPDATE gameData SET timeStart="'.$time_start.'" AND SET timeEnd="' . $time_end . '", AND SET timePlayed = timePlayed +"' .$time_played. '" - timeStart , AND SET counts = counts + 1 WHERE gameName ="' . $game_name . '";';
			$temp = $conn->prepare($sqlquery);
			$temp->execute();
			$temp = $temp->fetchAll(PDO::FETCH_ASSOC);
		    }
            echo json_encode(array('success' => 'yes'));
		//sem_release($sem_id); //We release the semaphore so that a restart can run if needed
        } catch (PDOException $e) {
            echo $sqlquery . "<br>" . $e->getMessage();
		//sem_release($sem_id); //We release the semaphore so that a restart can run if needed
        }
    } 
    else {
        echo "Error with parsing game data";
    }

}

if ($_SERVER["REQUEST_METHOD"] == "GET") {

   $getGameName = $_GET['gameName'];

    try {

        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sqlquery = 'SELECT * FROM gameData WHERE gameName="' . $game_name . '";';
        $temp = $conn->prepare($sqlquery);
        $temp->execute();
        $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

        if($temp > 0){
            echo json_encode(array('gameName' => $temp['gameName'], 'timePlayed' => $temp['timePlayed'], 'timesPlayed' => $temp['counts']));
        }else{
            echo json_encode(array('success' => 'no'));
        }

    }catch (PDOException $e) {
        echo $sqlquery . "<br>" . $e->getMessage();
    }

}
