<?php
$MEMSIZE = 512;
$SEMKEY = 1;
$SHMKEY = 2;

$sem_id = sem_get(SEM_KEY);

//Z's stuff should go here




if($_POST['run']) {
	//if( sem_acquire($sem_id)){
	shell_exec("sudo /sbin/shutdown -r +1");
	echo "Releasing semaphore";
	sem_release($sem_id);
	//	}
}

?> 
