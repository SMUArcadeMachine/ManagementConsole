<?php

if($_POST('restart'))
  shell_exec(reboot_wait.sh);


?>
