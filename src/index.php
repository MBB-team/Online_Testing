<?php
include("portailLib/session.php");
include("portailLib/portail.php");

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
<div class='titleContainer'>
<div class='title'>COGMOOD</div>
<div class='subTitle'>Humeur, anxiété et cognition</div>
</div>\n";

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
    <button title='Se déconnecter'>Se déconnecter<i class='material-icons'>close</i></button>
    </div>
    </form>
    </div>";
}
else // not identified.
{
    if(isMobile() || !isCompatibleBrowser()) //Check desktop computer and browser
    {
        // Display infos to get a compatible browser
        ?>
<div id='requierment'>
Pour le bon fonctionnement du site, l'utilisation d'un ordinateur (fixe ou portable) ainsi que d'un des navigateurs compatibles suivant est nécessaire :<br>
<ul>
<li><img class='navigatorIcon' src='img/Firefox_Icon.svg'>  Mozilla Firefox (Aide d'installation : pour <a href="https://support.mozilla.org/fr/kb/installer-firefox-windows" target="_blank">Microsoft Windows</a>, pour <a href="https://support.mozilla.org/fr/kb/installer-firefox-mac" target="_blank">Apple Mac OS</a>, pour <a href="https://support.mozilla.org/fr/kb/installer-firefox-linux" target="_blank">Linux</a>)</li>
<li><img class='navigatorIcon' src='img/Chrome_Icon.svg'>  Google Chrome (Aide d'installation : pour <a href="https://support.google.com/chrome/answer/95346#install_win" target="_blank">Microsoft Windows</a>, pour <a href="https://support.google.com/chrome/answer/95346#install_mac" target="_blank">Apple Mac OS</a>, pour <a href="https://support.google.com/chrome/answer/95346#install_linux" target="_blank">Linux</a>)</li>
</ul>
Après avoir lancé le navigateur compatible de votre choix, copiez l'adresse <span class='rawLink'><?php echo htmlspecialchars(getServerHost()); ?></span> dans la barre d'adresse.
</div>
        <?php
    }
    else // Display login form if brower compatible
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


