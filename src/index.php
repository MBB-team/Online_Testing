<?php
include("portailLib/session.php");

//declare empty variables
$formParticipantID = $formAction = $formTask = "";


$connectError = false; //flag to display an error message in the html form

//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $formParticipantID = test_input("participantID");
    $formAction = test_input("action");
    $formTask = test_input("task");
    //echo"<p>formAction:".$formAction."</p>";
    switch($formAction)
    {
        case "connect":
            if(!isIdentified())
            {
                identify($formParticipantID);
                if(!isIdentified())
                {
                    $connectError = true;
                }
            }
        break;
        case "runtask":
            if(isIdentified())
            {
                $prepareTaskSucces = prepareTask($formTask);
                if($prepareTaskSucces)
                {
                    //redirect to task
                    header("Location: ".$_SESSION["taskUrl"]);
                    exit();
                } else {
                    echo '<p>Only one session can be opened for one task at a time.</p>';
                    exit();
                }
                
            }
        break;
        case "disconnect":
            //echo"<p>disconnect</p>";
            unIdentify();
        break;
    }
}

//html header
echo "<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<link href='css/portail.css' rel='stylesheet' type='text/css'>
</head>
<body>
<p class='title'>MBB Online Testing</p>\n";

if(isIdentified())
{

    //get tasks
    $availableTasks = getAvailableTask();
    //display not done tasks
    echo "<div class='taskArea'>\n";
    echo "<p class='taskMenuTitle'>Tâches disponibles</p>\n";
    $notDoneCount = displayTasks($availableTasks,false);
    if($notDoneCount < 1)
        echo "<p>Toutes les tâches disponibles sont terminées.<br>Vous serez contacté par e-mail pour la prochaine session</p>\n";
    echo "</div>";
    
    //is there done tasks
    if( (count($availableTasks) - $notDoneCount) > 0)
    {
        echo "<hr class='taskAreaSeparator'>\n";

        //display done tasks
        echo "<div class='taskArea'>\n";
        echo "<p class='taskMenuTitle'>Tâches terminées</p>\n";
        displayTasks($availableTasks,true);
        echo "</div>";
    }


    //disconnect button
    echo "<div class='logout'>
    <form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
    <div>
    <div class='username'>".getParticipantID()."</div>
    <input type='hidden' name='action' value='disconnect'>
    <button title='Se déconnecter'><i class='material-icons'>close</i></button>
    </div>
    </form>
    </div>";
}
else // not identified. Display login form
{
    echo "<div class='login'>\n";
    echo "<p>Entrez votre identifiant pour poursuivre</p>\n";
    if($connectError)
    {
        echo "<p style='color:red'>Identifiant inconnu</p>\n";
    }
    echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>\n";
    echo "<div>\n";
    echo "<input type='text' name='participantID' placeholder='Identifiant'/>
    <button title='Se connecter'><div>Se connecter</div><i class='material-icons'>exit_to_app</i>
    </button>
    <input type='hidden' name='action' value='connect'>\n";
    echo "</div>\n";
    echo "</form>\n";
    echo "</div>\n";
}

echo '
</body>
</html>
';

//display tasks button in a table filtered by done status
//return number of tasks displayed
function displayTasks($tasks, $doneStatus)
{
    $itemCount = 0;
    foreach($tasks as $task)
    {
        if($task["done"] != $doneStatus)
            continue;
        $itemCount++;
        echo "<form class='taskButtonOuter' method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>\n";
        echo "<div>\n";
        echo "<input type='hidden' name='action' value='runtask'>\n<input type='hidden' name='task' value='".$task['taskID']."'>\n";
        echo "<button class='taskButton ".($doneStatus ? "taskDone" : "taskNotDone")."' title='Faire la tâche'".($doneStatus ? " disabled" : "").">\n";
        echo "<div class='taskButtonText'>".$task['taskName']."</div><i class='material-icons'>".($doneStatus ? "done" : "play_arrow")."</i>\n";
        echo "</button>\n";
        echo "</div>\n";
        echo "</form>\n";
    }
    return $itemCount;
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


