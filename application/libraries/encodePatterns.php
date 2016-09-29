<?php

$patterns = $_POST['json'];
$patterns = json_decode($patterns);
for($i=0;$i<count($patterns);$i++){
    $url = $patterns[$i]->url;
    $name = $patterns[$i]->name;


    $readFile = null;
    $buffer = null;
    $handle = @fopen($_SERVER['HTTP_ORIGIN'] . '/' . $url, "r");
    if ($handle) {
        while (($buffer = fgets($handle, 4096)) !== false) {
            $readFile .= $buffer;
        }
        if (!feof($handle)) {
            echo "Error: unexpected fgets() fail\n";
        }
        fclose($handle);
        $base64 = (base64_encode($readFile));
        $encodedFile =  $base64;
    }else{
        echo 'Fail';
        return;
    }


    $url = 'data:image/png;base64,' . $encodedFile;
    $patterns[$i]->url = $url;
}
echo json_encode($patterns);