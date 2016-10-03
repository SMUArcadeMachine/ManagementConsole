<?php

$filename = 'test_game_data.log';
$log = $_POST['log'];

echo $log;
file_put_contents( $filename, $log, FILE_APPEND);
file_put_contents( $filename, "\n", FILE_APPEND);

?>
