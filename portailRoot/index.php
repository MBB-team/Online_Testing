
<html>
<body>
<p>MBB Online Testing</p>
<?php
include("portailLib/session.php");

//declare empty variables
$participantID = $action = "";

$connectError = false; //flag to display an error message in the html form

//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $participantID = test_input($_POST["participantID"]);
    $action = test_input($_POST["action"]);

    switch($action)
    {
        case "connect":
            if(!isIdentified())
            {
                identify($participantID);
                if(!isIdentified())
                {
                    $connectError = true;
                }
            }
        break;
        case "disconnect":
            unIdentify();
        break;
    }
}

if(isIdentified())
{
    echo "<p>Bonjour utilisateur " . getParticipantID()."</p>";


    //Display available task
    $availableTasks = getAvailableTask();

    echo "<p style='font-weight: bold; font-size:200%'>Tâches disponibles</p>\n";
    echo "<table>\n";
    foreach($availableTasks as $availableTask)
    {
        
        echo "<tr>
        <td style='font-weight: bold'>" . $availableTask['taskName']."</td>\n";
        if($availableTask["done"])
        {
            echo "<td>Fait</td>";
        }
        else
        {
            //echo "<a href='".$availableTask["url"]."'>Cliquer ici pour faire la tache</a>";
            echo "<td><form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
            <input type='hidden' name='action' value='runtask'>
            <input type='hidden' name='task' value='".$availableTask['taskID']."'>
            <input type='submit' value='Faire la tâche'>
            </form></td>";
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
        echo "<p style='color:red'>Num&eacutero de sujet inconnu</p>";
    }
    echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
    <p>Votre num&eacutero de sujet : <input type='text' name='participantID' /></p>
    <p><input type='submit' value='OK'></p>
    <input type='hidden' name='action' value='connect'>
    </form>";
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }
?>

</body>
</html>

