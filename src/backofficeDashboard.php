<?php

include('portailLib/backoffice.php');


echo "<!DOCTYPE html>
    <html>
        <head>
        <meta charset='UTF-8'>
        <link href='css/backoffice.css' rel='stylesheet' type='text/css'>
        </head>
        <body>\n";


// get datas
$taskSessions = getAllTaskSessions();
//var_dump($taskSessions);

$doneRuns = getRunCountByTaskSessions(true);
$onlyStartedRuns = getRunCountByTaskSessions(false);
//var_dump($doneRuns);
//var_dump($onlyStartedRuns);

/*****************************/
/* Display all task sessions */
/*****************************/

$lastTaskID = "";
echo "<table>\n";
foreach($taskSessions as $key=>$taskSession)
{
    if($taskSession["task_taskID"] != $lastTaskID)
    {

        if($lastTaskID != "")
        {
            //close previous table
            echo "</tr>\n";
        }
        $lastTaskID = $taskSession["task_taskID"];
        //create a new table
        echo "<tr>\n";
        echo "<th>".$taskSession["task_taskID"]."</th>";
    }

    // get status of taskSession
    $openingTime = strtotime($taskSession["openingTime"]);
    $closingTime = strtotime($taskSession["closingTime"]);
    $now = strtotime("now");

    $status = "taskSessionOpen";
    if($closingTime<$now)
    {
        $status = "taskSessionClose";
    }
    if($openingTime>$now)
    {
        $status = "taskSessionNotOpen";
    }

    // display session infos
    echo "<td class='sessionCell'><div class='taskSession ".$status."'>\n";
    echo "<span class='sessionName'>".$taskSession["sessionName"]."</span><br>\n";
    echo "<span><i class='material-icons' style='color:green'>play_arrow</i>".$taskSession["openingTime"]."</span><br>\n";
    echo "<span><i class='material-icons' style='color:red'>stop</i>".$taskSession["closingTime"]."</span><br>\n";
    $doneRun = isset($doneRuns[$taskSession['taskSessionID']])?$doneRuns[$taskSession['taskSessionID']]:"0";
    echo "<span><i class='material-icons' style='color:green'>done</i>".$doneRun."</span><span> <i class='material-icons'>remove</i></span>\n";
    $onlyStartedRun = isset($onlyStartedRuns[$taskSession['taskSessionID']])?$onlyStartedRuns[$taskSession['taskSessionID']]:"0";
    echo "<span><i class='material-icons' style='color:red'>priority_high</i>".$onlyStartedRun."</span><br>\n";
    echo "</div></td>\n";
}

//final table closing
if($lastTaskID != "")
{
    //close previous table
    echo "</tr>\n</table>\n";
}

/*******************/
/* Display legends */
/*******************/

echo "<br>\n";
echo "<div class='legend'>\n";
echo "Legende : \n";
echo "<table><tr>\n";
echo "<td><div class='taskSessionClose'>Session fermée</div></td>";
echo "<td><div class='taskSessionOpen'>Session ouverte</div></td>";
echo "<td><div class='taskSessionNotOpen'>Session future</div></td>";
echo "<tr></table>\n";
echo "<span>Nombre d'utilisateurs ayant </span><span><i class='material-icons' style='color:green'>done</i>complété la tâche</span><span> <i class='material-icons'>remove</i></span>\n";
echo "<span><i class='material-icons' style='color:red'>priority_high</i>débuté la tache sans la complété</span><br>\n";
echo "</div>";

echo "</body>
</html>";

function test_input($data) {
    //return content of $_POST["$data"] with a bit of security
    //return empty string if $data is not found in $_POST
    if(!array_key_exists($data, $_POST))
    { return "";}

    $returnData = trim($_POST["$data"]);
    $returnData = stripslashes($returnData);
    $returnData = htmlspecialchars($returnData);
    return $returnData;
  }
?>