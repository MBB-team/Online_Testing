<?php

//include PHP session management and fonctions to interract with user part of database
include('../portailLib/session.php');
session_write_close(); //unlock other php script using current session

// this path should point to your configuration file.
include('database_config.php');

// Nothing needs to be changed after this:

$result = writeData($table);
echo json_encode($result);
?>
