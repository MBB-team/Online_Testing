<?php
// Change all the informations as needed and rename to 'database_config_session.php'

  $servername = 'localhost';
  $port = 3306; //
  $username = ''; 
  $password = '';
  $dbname = 'databaseEmo';

  $db = new mysqli($servername, $username, $password, $dbname) or die("Unable to connect");


?>
