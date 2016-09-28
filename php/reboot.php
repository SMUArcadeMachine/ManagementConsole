<?php

if($_POST['run']) {
	shell_exec("sudo /sbin/shutdown -r now");
}

?>
