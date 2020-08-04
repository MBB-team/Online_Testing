<?php

//include PHP session management and fonctions to interract with user part of database
include('../portailLib/session.php');

// this path should point to your configuration file.
include('database_config_quest.php');

// Nothing needs to be changed after this:

$data_all = json_decode(file_get_contents('php://input'), true);

$result = array(); // will return if insert were succeded (1) or failed (0) for each indexes
foreach($data_all as $key => $data_array)
{
  $result[$key] = 0; //temporary mark as failed
}
$result['message']="";

try {
  $conn = sessionOpenDataBase();

  // First stage is to get all column names from the table and store them in $col_names array.
  $stmt = $conn->prepare("SHOW COLUMNS FROM `$table`");
  $stmt->execute();
  $col_names = array();
  while($row = $stmt->fetchColumn()) {
    $col_names[] = $row;
  }
  // Second stage is to create prepared SQL statement using the column
  // names as a guide to what values might be in the JSON.

  foreach($data_all as $key => $data_json)
  {
    if( isIndexSaved($key) ) //already saved
    {
      $result[$key] = 2; //mark as already saved
      continue;
    }

    $data_array = json_decode($data_json, true);
    // If a value is missing from a particular trial, then NULL is inserted
    $sql = "INSERT INTO $table VALUES(";
    for($i = 0; $i < count($col_names); $i++){
      $name = $col_names[$i];
      $sql .= ":$name";
      if($i != count($col_names)-1){
        $sql .= ", ";
      }
    }
    $sql .= ");";
    $insertstmt = $conn->prepare($sql);
    for($i=0; $i < count($data_array); $i++){
      for($j = 0; $j < count($col_names); $j++){
        $colname = $col_names[$j];
        if( ($colname == "run_id") && isPreparedTask()){
          $insertstmt->bindValue(":$colname", getRunID() );
        }
        else if(!isset($data_array[$i][$colname])){
          $insertstmt->bindValue(":$colname", null, PDO::PARAM_NULL);
        } else {
          $insertstmt->bindValue(":$colname", $data_array[$i][$colname]);
        }
      }
      if($insertstmt->execute())
      {
        logIndexSaved($key);
        $result[$key] = 1; //mark as succeded
      }
    }
    
  }
  echo json_encode($result);
  
}
catch(PDOException $e)
{
  $result['message'] = $e->getMessage();
  echo json_encode($result);
}
$conn = null;
?>
