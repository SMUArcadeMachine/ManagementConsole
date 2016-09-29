<?php
/**
 * Created by PhpStorm.
 * User: Ziga
 * Date: 9/27/2016
 * Time: 1:20 AM
 */

$servername = "localhost";
$host = "localhost";
$dbname = "SMUAdminConsole";
$username = "admin";
$password = "8043v36m807c3084m6m03v";


//checks if tcorrect request
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Scrape activationKey from the url
        $temp = $conn->prepare('SELECT username FROM recovery WHERE recoveryKey="' . $_GET['recoveryKey'] . '";');
        $temp->execute();
        $temp = $temp->fetchAll(PDO::FETCH_ASSOC);

        // If match
        if ($temp) {
            $user = $temp[0]['username'];

            // Stores the new password
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $parsedReq = $request->getParsedBody();
                $hashedpw = password_hash($parsedReq['password'], PASSWORD_DEFAULT);
                $temp = $conn->prepare('UPDATE users SET password="' . $hashedpw . '" WHERE username="' . $user . '";');
                $temp->execute();
                $temp = $conn->prepare('DELETE FROM recovery WHERE username="' . $user . '";');
                $temp->execute();
            }
            //return $this->renderer->render($response, 'reset.html', $args);
            readfile("/path/to/reset.html");
        } else {
            redirect('/login'); //need full url
        }
    }catch (PDOException $e) {
        echo $sqlquery . "<br>" . $e->getMessage();
        echo json_encode(array('success' => 'no'));
    }
}

function redirect($url, $statusCode = 303)
{
    header('Location: ' . $url, true, $statusCode);
    die();
}