<?php

include('portailLib/backoffice.php');

$table = $onlyDone = $exportType = $sessionMode = $sessionID = "";
//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $table = test_input("table");
    $onlyDone = test_input("onlyDone");         //values : "true", "false"
    $exportType = test_input("exportType");     //values : "simple", "joined"
    $sessionMode = test_input("sessionMode");   //values : "All", "One" 
    $sessionID = test_input("sessionID");
}


$errorMessage = "";

if($table!="")
{
    //export CSV
    switch($exportType)
    {
        case "simple":
            $errorMessage = exportCSVSimpleTable($table);
            break;
        case "joined":
            switch($sessionMode)
            {
                case "All":
                    $errorMessage = exportCSVJoinedTable($table, $onlyDone=="true");
                    break;
                case "One":
                    $errorMessage = exportCSVJoinedTable($table, $onlyDone=="true", $sessionID);
                    break;
            }
            break;
    }

}



    //display form
    echo "<!DOCTYPE html>
    <html>
        <head>
        <meta charset='UTF-8'>
        <link href='css/backoffice.css' rel='stylesheet' type='text/css'>
        </head>
        <body>\n";

    echo backofficeMenu()."<br>\n";

    if($errorMessage!="")
    {
        echo "<p style='color:red'>".$errorMessage."</p>";
    }

    //simple export
    echo "<p>Export d'une table</p>";
    echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
        <input type='hidden' name='exportType' value='simple'>
        <p>Table à exporter : ";

    displayDropDownList('table', getAllTables());
    echo "</p>";
    echo "<input type='submit' value='Exporter'>
    </form>";

    echo "<br><br>";

    //joined dataTask export
    echo "<p>Export des données pour une tâche (table de la tâche + taskSession + run)</p>";
    echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
        <input type='hidden' name='exportType' value='joined'>
        <p>Table de tâche à exporter : ";

    displayDropDownList('table', getDataTaskTables(), 'task', 'onTaskClick()');
    echo "</p>\n";

    //session
    
    echo "<p>\n";
    echo "<input type='radio' id='sessionModeAll' name='sessionMode' value='All' checked onClick='showSessionList()'><label for='sessionModeAll'>Toutes les sessions</label>\n";
    echo "<input type='radio' id='sessionModeOne' name='sessionMode' value='One' onClick='showSessionList()'><label for='sessionModeOne'>Une seule session</label>\n";

    echo "<select id='sessionID' name='sessionID' hidden>\n";
    echo "</select>\n";
    echo "</p>\n";
    echo "<script>
    showSessionList();
    updateSesionList(document.getElementById('task'));
    function showSessionList()
    {
        var sessionModeAll = document.getElementById('sessionModeAll').checked;
        var sessionModeOne = document.getElementById('sessionModeOne').checked;
        if( (sessionModeAll == null) || (sessionModeAll == sessionModeOne) )
        {
            console.log('Error with sessionMode radio buttons');
            return;
        }
        document.getElementById('sessionID').hidden = sessionModeAll;
    }
    function onTaskClick(e)
    {
        if (!e) e = window.event;
        updateSesionList(e.target);
    }
    function updateSesionList(from)
    {
        console.log(from);
        var taskSessions = {\n";

    //javascript array of sessions
    $lastTaskID = "";
    $taskSessions = getAllTaskSessions();
    foreach($taskSessions as $key=>$taskSession)
    {
        if($taskSession["task_taskID"] != $lastTaskID)
        {
            if($lastTaskID != "")
                echo "},\n";
            $lastTaskID = $taskSession["task_taskID"];
            echo $taskSession["task_taskID"].":{\n";
        }
        echo $taskSession['taskSessionID'].":{sessionName:'".$taskSession['sessionName']."',
        taskSessionID:".$taskSession['taskSessionID']."},\n";
    }
    if($lastTaskID != "")
        echo "}\n";
    echo "};\n";

    //javascript update sessions list 
    echo "var taskID = from.selectedOptions[0].attributes.taskid.value;\n";
    echo "document.getElementById('sessionID').innerHTML = ''\n";
    echo "for(var key in taskSessions[taskID])
    {
        var opt = document.createElement('option');
        opt.value = key;
        opt.innerHTML = taskSessions[taskID][key]['sessionName'];
        document.getElementById('sessionID').add(opt);
    }";

    echo "}
    </script>\n";

    echo "<p>Exclure les run incomplets : <input type='checkbox' name='onlyDone' value='true'></p>
        <input type='submit' value='Exporter'>
        </form>";

    echo '</body>
    </html>';

// display a dropdown list from array
// if array's key is a string, use it as label 
function displayDropDownList($fieldName, $items, $htmlID="", $onchange="")
{
    echo "<select name='".$fieldName."'";
    if(!empty($htmlID))
        echo " id='".$htmlID."' ";
    if(!empty($onchange))
        echo " onchange='".$onchange."' ";
    echo ">\n";
    foreach($items as $key => $item)
    {
        echo "<option value='".$item['dataTableName'];
        echo (isset($item['taskID']))?("' taskID='".$item['taskID']):"";
        echo "'>";
        if(isset($item['taskName']) && is_string($item['taskName']))
            echo $item['taskName'].' ('.$item['dataTableName'].')';
        else
            echo $item['dataTableName'];
        echo "</option>\n";
    }
    echo "</select>\n";
}

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