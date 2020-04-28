<?php
// Change all the informations as needed

  $servername = 'localhost';
  $port = 3306; //
  $username = 'root'; // this is the default for XAMPP.
  $password = '';
  $dbname = 'databaseEmo';
  $table = "tableConstance";

  $db = new mysqli('localhost', $username, $password, $dbname) or die("Unable to connect");

  // echo "Success, connected to my databaseEmo MySQL with PHP"
?>
