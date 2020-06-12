<?php

include('portailLib/backoffice.php');


echo "<!DOCTYPE html>
    <html>
        <head>
        <meta charset='UTF-8'>
        <link href='css/backoffice.css' rel='stylesheet' type='text/css'>
        <script
            type='text/javascript'
            src='https://unpkg.com/vis-timeline@latest/standalone/umd/vis-timeline-graph2d.min.js'
        ></script>
        </head>
        <body>
        <a href='backofficeExport.php'>Exporter des données</a><br>\n";


// get datas
$taskSessions = getAllTaskSessions();
$dataTaskTables = getDataTaskTables();
$doneRuns = getRunCountByTaskSessions(true);
$onlyStartedRuns = getRunCountByTaskSessions(false);

/***************************/
/* Display legends + Usage */
/***************************/
?>
<br>
<div class='legend'>
Legende : 
<table><tr>
<td><div class='taskSessionClose'>Session fermée</div></td>
<td><div class='taskSessionOpen'>Session ouverte</div></td>
<td><div class='taskSessionNotOpen'>Session future</div></td>
<tr></table>
<span>Nombre d'utilisateurs ayant </span><span><i class='material-icons' style='color:green'>done</i>complété la tâche</span><span> <i class='material-icons'>remove</i></span>
<span><i class='material-icons' style='color:red'>priority_high</i>débuté la tache sans la complété</span><br>
</div>
<br>
<div class='usage'>
    Commandes : <br>
    Zoom : Curseur sur le graphique chronologique, Ctrl + molette de la souris<br>
    Déplacement : clic + glisser sur le graphique chronologique
</div>
<br>

<?php
/*****************************/
/* Display all task sessions */
/*       in a timeline       */
/*****************************/
?>


<div id="visualization"></div>
<script>

var groups = new vis.DataSet();
var items = new vis.DataSet();
<?php
$lastTaskID = "";
$idGroup = -1;
$idItem = -1;
$dataTaskTable="";
foreach($taskSessions as $key=>$taskSession)
{
    if($taskSession["task_taskID"] != $lastTaskID)
    {

        if($lastTaskID != "")
        {
            //close previous group
        }
        $lastTaskID = $taskSession["task_taskID"];
        $dataTaskTableName = getDataTaskTableName($dataTaskTables, $lastTaskID);
        //new group
        $idGroup += 1;
        echo "groups.add({
            id: ".$idGroup.",\n";
        if(!empty($dataTaskTableName))
            echo "content: '".$taskSession["task_taskID"]."<br><button class=\\'download\\' tableName=\\'".$dataTaskTableName."\\' onClick=\\'showDownloadTaskData();\\' title=\\'Exporter les données la tâche ".$taskSession["task_taskID"]."\\'><i class=\\'material-icons\\' tableName=\\'".$dataTaskTableName."\\'>get_app</i></button>',\n";
        else
        echo "content: '".$taskSession["task_taskID"]."<br><button class=\\'download\\' title=\\'Cette tâche ne sauvegarde pas de données\\' disabled><i class=\\'material-icons\\'>get_app</i></button>',\n";
        echo "order: ".$idGroup."
        });\n";
    }

    // get status of taskSession
    $openingTime = strtotime($taskSession["openingTime"]);
    $closingTime = strtotime($taskSession["closingTime"]);
    $now = strtotime("now");

    $status = "taskSessionOpen";
    $itemCellStatus = "itemCellSessionOpen";
    if($closingTime<$now)
    {
        $status = "taskSessionClose";
        $itemCellStatus = "itemCellSessionClose";
    }
    if($openingTime>$now)
    {
        $status = "taskSessionNotOpen";
        $itemCellStatus = "itemCellSessionNotOpen";
    }

    $idItem += 1;
    echo "items.add({
        id: ".$idItem.",
        group: ". $idGroup .",
        start: ". $openingTime*1000 .",
        end: ". ($closingTime*1000-1000) .",
        className: '". $itemCellStatus ."',
        type: 'range',
        content: '";

        //echo $taskSession["sessionName"];
    // display session infos
    $itemContent = "<div class='taskSession ".$status."'>\n";
    $itemContent .= "<span class='sessionName'>".$taskSession["sessionName"]."</span><br>\n";
    $doneRun = isset($doneRuns[$taskSession['taskSessionID']])?$doneRuns[$taskSession['taskSessionID']]:"0";
    $itemContent .= "<span><i class='material-icons' style='color:green'>done</i>".$doneRun."</span><span> <i class='material-icons'>remove</i></span>\n";
    $onlyStartedRun = isset($onlyStartedRuns[$taskSession['taskSessionID']])?$onlyStartedRuns[$taskSession['taskSessionID']]:"0";
    $itemContent .= "<span><i class='material-icons' style='color:red'>priority_high</i>".$onlyStartedRun."</span><br>\n";
    $itemContent .= "</div>";
    $itemContent = str_replace("'", "\\'", $itemContent);
    $itemContent = str_replace("\n", "\\\n", $itemContent);
    echo $itemContent;

    echo "'\n});\n"; //close items.add
}
?>
var options = {
            stack: false,
            maxHeight: 640,
            horizontalScroll: false,
            verticalScroll: false,
            zoomKey: "ctrlKey",
            start: Date.now() - 1000 * 60 * 60 * 24 * 7, // minus 5 days
            end: Date.now() + 1000 * 60 * 60 * 24 * 7, // plus 5 days
            orientation: {
                axis: "both",
                item: "top"
            },
            selectable: false,
            groupHeightMode: 'fixed',
            align: 'center',
        };

// create a Timeline
var container = document.getElementById('visualization');
timeline = new vis.Timeline(container, items, groups, options);

function showDownloadTaskData(e)
{
    var x = 0,
        y = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var noteDiv = document.getElementById("downloadTaskData");
    noteDiv.style.display = "block";
    noteDiv.style.left = (x + 20) + "px";
    noteDiv.style.top = (y) + "px";
    console.log(e);
    document.getElementById("downloadTaskDatatableName").value=e.target.getAttribute("tableName");
}

function HideDownloadTaskData()
{
    document.getElementById("downloadTaskData").style.display = "none";
}
</script>
<div id='downloadTaskData'>
    <div style="margin: 2px; float: right;"><button class='closeFloatDiv' onclick="HideDownloadTaskData()"><i class='material-icons'>close</i></span>
    </div>
    <br clear="all">
    <div id='downloadTaskDataContent'>
        <form method='post' action='backofficeExport.php'>
            <input type='hidden' name='exportType' value='joined'>
            <input id='downloadTaskDatatableName' type='hidden' name='table' value=''>
            <input type='hidden' name="sessionMode" value="All">
            <p>Exclure les run incomplets : <input type='checkbox' name='onlyDone'></p>
            <button>Exporter</button>
        </form>
    </div>
</div>

<?php
echo "</body>
</html>";

function getDataTaskTableName($dataTaskTables, $taskID)
{
    foreach($dataTaskTables as $dataTaskTable)
    {
        if($dataTaskTable["taskID"]==$taskID)
            return $dataTaskTable["dataTableName"];
    }
    return "";
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