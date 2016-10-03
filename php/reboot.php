<?php

if($_POST['log']){
  shell_exec("sudo bash ../documentation/scripts/rbt.sh");
}

?>
