<?php

if($_POST['run']){
  shell_exec("sudo bash ../documentation/scripts/rbt.sh");
}

?>
