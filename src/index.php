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
echo '<!DOCTYPE html>
<html>
    <head>
    <meta charset="UTF-8">
    <link href="css/portail.css" rel="stylesheet" type="text/css">
    </head>
    <body>
    <p>MBB Online Testing</p>
    ';

if(isIdentified())
{

    

    echo "<p>Bonjour utilisateur " . getParticipantID()."</p>";


    //get tasks
    $availableTasks = getAvailableTask();
    //display not done tasks
    echo "<p class='taskMenuTitle'>Tâches disponibles</p>\n";
    echo "<div class='centerArea'>\n";
    $notDoneCount = displayTasks($availableTasks,false);
    if($notDoneCount < 1)
        echo "<p>Toutes les tâches disponibles sont terminées.<br>Vous serez contacté par e-mail pour la prochaine session</p>\n";
    echo "</div>";
    
    //is there done tasks
    if( (count($availableTasks) - $notDoneCount) > 0)
    {
        echo "<hr class='separator'>\n";

        //display done tasks
        echo "<p class='taskMenuTitle'>Tâches terminées</p>\n";
        echo "<div class='centerArea'>\n";
        displayTasks($availableTasks,true);
        echo "</div>";
    }


    //disconnect button
    echo "<br>
    <form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
    <input type='hidden' name='action' value='disconnect'>
    <input type='submit' value='Se déconnecter'>
    </form>";
}
else // not identified. Display login form
{
    if($connectError)
    {
        echo "<p style='color:red'>Numéro de sujet inconnu</p>";
    }
    echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
    <p>Votre numéro de sujet : <input type='text' name='participantID' /></p>
    <p><input type='submit' value='OK'></p>
    <input type='hidden' name='action' value='connect'>
    </form>";
}

echo '
</body>
</html>
';

//display tasks button in a table filtered by done status
//return number of tasks displayed
function displayTasks($tasks, $doneStatus)
{
    echo "<div class='centerArea'>\n<table class='taskTable'>";
    $itemCount = 0;
    foreach($tasks as $task)
    {
        if($task["done"] != $doneStatus)
            continue;
        $itemCount++;
        echo "<tr>\n<td>\n";
        echo "<form class='taskButtonOuter' method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>\n";
        echo "<input type='hidden' name='action' value='runtask'>\n<input type='hidden' name='task' value='".$task['taskID']."'>\n";
        echo "<button class='taskButton ".($doneStatus ? "taskDone" : "taskNotDone")."' title='Faire la tâche'".($doneStatus ? " disabled" : "").">\n";
        echo "<div class='taskButtonText inline-block'>".$task['taskName']."</div><i class='material-icons inline-block'>".($doneStatus ? "done" : "play_arrow")."</i>\n";
        echo "</button>\n</form>\n</td>\n</tr>\n";
    }
    echo "</table>\n</div>\n";
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


