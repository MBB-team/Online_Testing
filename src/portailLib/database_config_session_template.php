<?php
// Change all the informations as needed and rename to 'database_config_session.php'

  $servername = 'mariadb-docker';
  $port = 3306;
  $username = 'root'; 
  $password = '7zh4GiKqboNSYaSZVTJ6n'; # A password used for local debug only
  $dbname = 'databaseEmo';

  $db = new mysqli($servername, $username, $password, $dbname) or die("Unable to connect");

?>
