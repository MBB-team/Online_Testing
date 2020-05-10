<?php
  $servername = 'mariadb-docker';
  $port = 3306;
  $username = 'root';
  $password = '';
  $dbname = 'databaseEmo';
  $table = "tableSE";

  $db = new mysqli($servername, $username, $password, $dbname) or die("Unable to connect");
?>
