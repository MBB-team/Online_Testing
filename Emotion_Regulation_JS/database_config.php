<?php

  // common database parameters moved to
  // portailLib/database_config_session.php
  // see portailLib/database_config_session_template.php
  // use :
  //
  // include('../portailLib/session.php');
  // include('database_config.php'); //just for table name
  // $conn = sessionOpenDataBase()
  //
  // instead of :
  //
  // include('database_config.php');
  // $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
  // $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $table = "tableEmo";

?>