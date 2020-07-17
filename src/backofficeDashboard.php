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
<div style='display:flex'>
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
<div class='usage'>
    Commandes : <br>
    Zoom : Curseur sur le graphique chronologique, Ctrl + molette de la souris<br>
    Déplacement : clic + glisser sur le graphique chronologique
</div>
</div>
<?php
/*****************************/
/* Display all task sessions */
/*       in a timeline       */
/*****************************/
?>


<div id="visualization"></div>
<script>

Date.prototype.getFullDate = function()
    {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [this.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
                ].join('-');
    };

    Date.prototype.getFullDateFR = function()
    {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [(dd>9 ? '' : '0') + dd,
                (mm>9 ? '' : '0') + mm,
                this.getFullYear()
                ].join('-');
    };

    Date.prototype.getFullTime = function()
    {
        var hh = this.getHours(); 
        var mm = this.getMinutes();

        return [(hh>9 ? '' : '0') + hh,
                (mm>9 ? '' : '0') + mm,
                ].join(':');
    };

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
        
        /*** group content ***/
        $content = "'<div class=\\'groupTask\\'>";
        //display taskID
        $content .= $taskSession["task_taskID"]."<br>";

        //download button
        if(!empty($dataTaskTableName))
            $content .= "<button class=\\'download\\' tableName=\\'".$dataTaskTableName."\\' onClick=\\'showDownloadTaskData();\\' title=\\'Exporter les données la tâche ".$taskSession["task_taskID"]."\\'><i class=\\'material-icons\\' tableName=\\'".$dataTaskTableName."\\'>get_app</i></button>";
        else
            $content .= "<button class=\\'download\\' title=\\'Cette tâche ne sauvegarde pas de données\\' disabled><i class=\\'material-icons\\'>get_app</i></button>";

        //add session button
        $content .= "<button class=\\'addSession\\' taskID=\\'".$taskSession["task_taskID"]."\\' onClick=\\'showAddSession();\\' title=\\'Ajouter une session ".$taskSession["task_taskID"]."\\'><i class=\\'material-icons\\' taskID=\\'".$taskSession["task_taskID"]."\\'>add</i></button>";
        $content .= "</div>',\n";
        /*** group content end***/
        echo "content: ".$content;

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
    if(!empty($dataTaskTableName))
        $itemContent .= "<button class='download' tableName='".$dataTaskTableName."' sessionID='".$taskSession["taskSessionID"]."' onClick='showDownloadSessionData();' title='Exporter les données de la session ".$taskSession["sessionName"]." uniquement'><i class='material-icons' tableName='".$dataTaskTableName."' sessionID='".$taskSession["taskSessionID"]."'>get_app</i></button>\n";
    else
        $itemContent .= "<button class='download' title='Cette tâche ne sauvegarde pas de données' disabled><i class='material-icons'>get_app</i></button>\n";
    if( ($status == "taskSessionNotOpen") || ($status == "taskSessionOpen") )
        $itemContent .= "<button class='edit' sessionName='".$taskSession["sessionName"]."' sessionID='".$taskSession["taskSessionID"]."' openingTime='".$openingTime."' closingTime='".$closingTime."' onClick='showEditSession();' title='Modifier les dates de la session ".$taskSession["sessionName"]."'><i class='material-icons' sessionName='".$taskSession["sessionName"]."' sessionID='".$taskSession["taskSessionID"]."' openingTime='".$openingTime."' closingTime='".$closingTime."'>edit</i></button>\n";
    else
        $itemContent .= "<button class='edit' title='Une session passée ne peut pas être modifiée' disabled><i class='material-icons'>edit</i></button>\n";
    $itemContent .= "</div>";
    $itemContent = str_replace("'", "\\'", $itemContent);
    $itemContent = str_replace("\n", "\\\n", $itemContent);
    echo $itemContent;

    echo "'\n});\n"; //close items.add
}
?>
var options = {
            stack: false,
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
    document.getElementById("downloadTaskDatatableName").value=e.target.getAttribute("tableName");
}

function HideDownloadTaskData()
{
    document.getElementById("downloadTaskData").style.display = "none";
}

function showDownloadSessionData(e)
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
    var noteDiv = document.getElementById("downloadSessionData");
    noteDiv.style.display = "block";
    noteDiv.style.left = (x + 20) + "px";
    noteDiv.style.top = (y) + "px";
    document.getElementById("downloadSessionDatatableName").value=e.target.getAttribute("tableName");
    document.getElementById("downloadSessionID").value=e.target.getAttribute("sessionID");

}

function HideDownloadSessionData()
{
    document.getElementById("downloadSessionData").style.display = "none";
}

function showEditSession(e)
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
    var noteDiv = document.getElementById("editSession");
    noteDiv.style.display = "block";
    noteDiv.style.left = (x + 20) + "px";
    noteDiv.style.top = (y) + "px";

    document.getElementById("editSessionTitle").innerText = e.target.getAttribute("sessionName");
    document.getElementById("editSessionID").value = e.target.getAttribute("sessionID");

    

    dateNow = new Date()

    openingDate = new Date(e.target.getAttribute("openingTime")*1000);
    closingDate = new Date(e.target.getAttribute("closingTime")*1000);

    document.getElementById("currentOpeningTime").innerText = openingDate.getFullDateFR() + " " + openingDate.getFullTime();
    document.getElementById("editOpeningDate").value = openingDate.getFullDate();
    document.getElementById("editOpeningHour").value = openingDate.getFullTime();
    if(openingDate<dateNow)
    {
        //past date : no editing allowed
        document.getElementById("editOpeningDate").disabled = true;
        document.getElementById("editOpeningDate").min = "";
        document.getElementById("editOpeningHour").disabled = true;
        document.getElementById("editOpeningHour").min = "";
    }
    else
    {
        document.getElementById("editOpeningDate").disabled = false;
        document.getElementById("editOpeningDate").min = dateNow.getFullDate();
        document.getElementById("editOpeningHour").disabled = false;
        updateMinOpeningHour();
    }
    
    document.getElementById("currentClosingTime").innerText = closingDate.getFullDateFR() + " " + closingDate.getFullTime();
    document.getElementById("editClosingDate").value = closingDate.getFullDate();
    document.getElementById("editClosingHour").value = closingDate.getFullTime();

    if(closingDate<dateNow)
    {
        //past date : no editing allowed
        document.getElementById("editClosingDate").disabled = true;
        document.getElementById("editClosingDate").min = "";
        document.getElementById("editClosingHour").disabled = true;
        document.getElementById("editClosingHour").min = "";
    }
    else
    {
        document.getElementById("editClosingDate").disabled = false;
        document.getElementById("editClosingDate").min = dateNow.getFullDate();
        document.getElementById("editClosingHour").disabled = false;
        updateMinClosingHour();
    }
}

function updateMinOpeningHour()
{
    dateNow = new Date();

    newDate = new Date(document.getElementById("editOpeningDate").value);

    if(newDate.getFullDate() == dateNow.getFullDate())
    {
        document.getElementById("editOpeningHour").min = dateNow.getFullTime();
    }
    else
    {
        document.getElementById("editOpeningHour").min = "";
    }
}

function updateMinClosingHour()
{
    dateNow = new Date();

    newDate = new Date(document.getElementById("editClosingDate").value);

    if(newDate.getFullDate() == dateNow.getFullDate())
    {
        document.getElementById("editClosingHour").min = dateNow.getFullTime();
    }
    else
    {
        document.getElementById("editClosingHour").min = "";
    }
}

function submitEditSessionForm()
{
    event.preventDefault(); //prevent reload page

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "backofficeEditSession.php", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "editType=" + document.getElementById("editType").value;
    params += "&sessionID=" + document.getElementById("editSessionID").value;
    params += "&editOpeningDate=" + document.getElementById("editOpeningDate").value;
    params += "&editOpeningHour=" + document.getElementById("editOpeningHour").value;
    params += "&editClosingDate=" + document.getElementById("editClosingDate").value;
    params += "&editClosingHour=" + document.getElementById("editClosingHour").value;

    xhr.onload = function() {
        var reponse = "";
        if(xhr.status == 200){
                var response = JSON.parse(xhr.responseText); // $.parseJSON
        }
        if(response.success){
                console.log("session updated");
                document.location.reload(true); //reload page
        }
        else {
                console.log("error on update session");
                console.log(response);
                window.alert("Erreur : " + response.message);
        }
    }
    xhr.send(params);
}

function HideEditSession()
{
    document.getElementById("editSession").style.display = "none";
}

function showAddSession(e)
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
    var noteDiv = document.getElementById("addSession");
    noteDiv.style.display = "block";
    noteDiv.style.left = (x + 20) + "px";
    noteDiv.style.top = (y) + "px";

    document.getElementById("addSessionTitle").innerText = e.target.getAttribute("taskID");
    document.getElementById("addSessionTaskID").value = e.target.getAttribute("taskID");

    dateNow = new Date()

    openingDate = new Date(e.target.getAttribute("openingTime")*1000);
    closingDate = new Date(e.target.getAttribute("closingTime")*1000);

    document.getElementById("addOpeningDate").value = dateNow.getFullDate();
    document.getElementById("addOpeningHour").value = dateNow.getFullTime();
    
    document.getElementById("addOpeningDate").disabled = false;
    document.getElementById("addOpeningDate").min = dateNow.getFullDate();
    document.getElementById("addOpeningHour").disabled = false;
    updateAddMinOpeningHour();
    
    document.getElementById("addClosingDate").value = dateNow.getFullDate();
    document.getElementById("addClosingHour").value = dateNow.getFullTime();

    document.getElementById("addClosingDate").disabled = false;
    document.getElementById("addClosingDate").min = dateNow.getFullDate();
    document.getElementById("addClosingHour").disabled = false;
    updateAddMinClosingHour();

}

function updateAddMinOpeningHour()
{
    dateNow = new Date();

    newDate = new Date(document.getElementById("addOpeningDate").value);

    if(newDate.getFullDate() == dateNow.getFullDate())
    {
        document.getElementById("addOpeningHour").min = dateNow.getFullTime();
    }
    else
    {
        document.getElementById("addOpeningHour").min = "";
    }
}

function updateAddMinClosingHour()
{
    dateNow = new Date();

    newDate = new Date(document.getElementById("addClosingDate").value);

    if(newDate.getFullDate() == dateNow.getFullDate())
    {
        document.getElementById("addClosingHour").min = dateNow.getFullTime();
    }
    else
    {
        document.getElementById("addClosingHour").min = "";
    }
}

function submitAddSessionForm()
{
    event.preventDefault(); //prevent reload page

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "backofficeEditSession.php", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "editType=" + document.getElementById("addType").value;
    params += "&taskID=" + document.getElementById("addSessionTaskID").value;
    params += "&editOpeningDate=" + document.getElementById("addOpeningDate").value;
    params += "&editOpeningHour=" + document.getElementById("addOpeningHour").value;
    params += "&editClosingDate=" + document.getElementById("addClosingDate").value;
    params += "&editClosingHour=" + document.getElementById("addClosingHour").value;
    params += "&sessionName=" + document.getElementById("addSessionName").value;

    xhr.onload = function() {
        var reponse = "";
        console.log(xhr.responseText);
        if(xhr.status == 200){
                var response = JSON.parse(xhr.responseText); // $.parseJSON
        }
        if(response.success){
                console.log("session updated");
                document.location.reload(true); //reload page
        }
        else {
                console.log("error on update session");
                console.log(response);
                window.alert("Erreur : " + response.message);
        }
    }
    xhr.send(params);
}

function HideAddSession()
{
    document.getElementById("addSession").style.display = "none";
}

</script>
<div id='downloadTaskData'>
    <div style="margin: 2px; float: right;"><button class='closeFloatDiv' onclick="HideDownloadTaskData()"><i class='material-icons'>close</i></button>
    </div>
    <br clear="all">
    <div id='downloadTaskDataContent'>
        <form method='post' action='backofficeExport.php'>
            <input type='hidden' name='exportType' value='joined'>
            <input id='downloadTaskDatatableName' type='hidden' name='table' value=''>
            <input type='hidden' name='sessionMode' value='All'>
            <p>Exclure les run incomplets : <input type='checkbox' name='onlyDone'></p>
            <button>Exporter</button>
        </form>
    </div>
</div>
<div id='downloadSessionData'>
    <div style="margin: 2px; float: right;"><button class='closeFloatDiv' onclick="HideDownloadSessionData()"><i class='material-icons'>close</i></button>
    </div>
    <br clear="all">
    <div id='downloadTaskDataContent'>
        <form method='post' action='backofficeExport.php'>
            <input type='hidden' name='exportType' value='joined'>
            <input id='downloadSessionDatatableName' type='hidden' name='table' value=''>
            <input type='hidden' name='sessionMode' value='One'>
            <input type='hidden' id='downloadSessionID' name='sessionID' value=''>
            <p>Exclure les run incomplets : <input type='checkbox' name='onlyDone'></p>
            <button>Exporter</button>
        </form>
    </div>
</div>
<div id='editSession'>
    <div style="margin: 2px; float: right;"><button class='closeFloatDiv' onclick="HideEditSession()"><i class='material-icons'>close</i></button>
    </div>
    <br clear="all">
    <div id='editSessionContent'>
    <p>Modifier la session <span id='editSessionTitle'></span></p>
        <form method='post' action='' onsubmit='submitEditSessionForm()'>
            <input id='editType' type='hidden' name='editType' value='editSession'>
            <input id='editSessionID' type='hidden' name='sessionID' value=''>
            <p>Date d'ouverture courrante : <span id='currentOpeningTime'></span><br>
            Nouvelle date d'ouverture :
            <input id='editOpeningDate' type='date' name='editOpeningDate' onchange='updateMinOpeningHour()' required>
            <input id='editOpeningHour' type='time' name='editOpeningHour' required>
            </p>
            <p>Date de fermeture courante : <span id='currentClosingTime'></span><br>
            Nouvelle date de fermeture :
            <input id='editClosingDate' type='date' name='editClosingDate' onchange='updateMinClosingHour()' required>
            <input id='editClosingHour' type='time' name='editClosingHour' required>
            </p>
            <button>Appliquer</button>
        </form>
    </div>
</div>
<div id='addSession'>
    <div style="margin: 2px; float: right;"><button class='closeFloatDiv' onclick="HideAddSession()"><i class='material-icons'>close</i></button>
    </div>
    <br clear="all">
    <div id='addSessionContent'>
    <p>Ajouter un session de la tâche <span id='addSessionTitle'></span></p>
        <form method='post' action='' onsubmit='submitAddSessionForm()'>
            <input id='addType' type='hidden' name='editType' value='addSession'>
            <input id='addSessionTaskID' type='hidden' name='taskID' value=''>
            Nom de la nouvelle session : <input id='addSessionName' name='sessionName' value=''>
            <p>
            Date d'ouverture :
            <input id='addOpeningDate' type='date' name='addOpeningDate' onchange='updateAddMinOpeningHour()' required>
            <input id='addOpeningHour' type='time' name='addOpeningHour' required>
            </p>
            <p>
            Date de fermeture :
            <input id='addClosingDate' type='date' name='addClosingDate' onchange='updateAddMinClosingHour()' required>
            <input id='addClosingHour' type='time' name='addClosingHour' required>
            </p>
            <button>Ajouter</button>
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