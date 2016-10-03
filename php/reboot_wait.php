<?php

if($_POST('restart'))
  shell_exec(sudo var/www/html/php/reboot_wait.sh);


?>
