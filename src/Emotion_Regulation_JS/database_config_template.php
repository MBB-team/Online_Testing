<?php
// Change all the informations as needed

  $servername = 'mariadb-docker';
  $port = 3306;
  $username = 'root'; // this is the default for XAMPP.
  $password = '';
  $dbname = 'databaseEmo';
  $table = "tableEmo";

  $db = new mysqli($servername, $username, $password, $dbname) or die("Unable to connect");

?>
