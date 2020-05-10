<?php
// Change all the informations as needed

  $servername = 'mariadb-docker';
  $port = 3306; //
  $username = 'root'; // this is the default for XAMPP.
  $password = '67jyt645ez5LFJIyrege456g48r';
  $dbname = 'databaseEmo';
  $table = "tableSE";

  $db = new mysqli($servername, $username, $password, $dbname) or die("Unable to connect");

  // echo "Success, connected to my databaseEmo MySQL with PHP"
?>
