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


    //Display available task
    $availableTasks = getAvailableTask();

    echo "<p style='font-weight: bold; font-size:200%'>Tâches disponibles</p>\n";
    echo "<table class='taskList'>\n";
    foreach($availableTasks as $availableTask)
    {
        
        echo "<tr>\n";
        if($availableTask["done"])
        {
            echo "<td class='taskDone'>".$availableTask['taskName']."</td>";
            echo "<td><img class='checkmark' src='img/checkmark.png'></td>";
            
        }
        else
        {
            echo "<td>".$availableTask['taskName']."</td>";
            echo "<td><form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
            <input type='hidden' name='action' value='runtask'>
            <input type='hidden' name='task' value='".$availableTask['taskID']."'>\n";
            echo "<input class='playButton' type='image' alt='Faire la tâche' src='img/playButton.png'
                   onmouseover=\"this.src='img/playButtonHL.png';\" onmouseout=\"this.src='img/playButton.png';\" >";
            echo "</form></td>";
        }
        echo "</tr>\n";
    }
    echo "</table>\n";
    
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


