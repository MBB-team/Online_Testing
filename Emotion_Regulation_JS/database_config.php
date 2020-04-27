<?php

  $servername = 'localhost';
  $port = 3306;
  $user = 'root';
  $pass = '';
  $db = 'databaseEmo';
  $table = "tableEmo";

  $db = new mysqli('localhost', $user, $pass, $db) or die("Unable to connect");

  echo "Success, connected to my databaseEmo MySQL with PHP"
?>
