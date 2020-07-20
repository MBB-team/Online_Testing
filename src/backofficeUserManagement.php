<?php

include('portailLib/backoffice.php');

$action = $participantID = $newStatus = $addParticipantIDList = "";
//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = test_input("action");              //values : "addParticipants", "setParticipantIDStatus"
    $participantID = test_input("participantID");           //set Status for participantID (action="setparticipantIDStatus")
    $newStatus = test_input("newStatus");       //new status velues : "active", "inactive" (action="setparticipantIDStatus")
    $addParticipantIDList = test_input("addParticipantIDList"); //new participants ID list to be added in dataBase  (action="addParticipants")
}

$errorMessage = "";

switch($action)
{
    case "": //no action
        break;
    case "addParticipants": //add a list of userID
        if(empty($addParticipantIDList))
            $errorMessage = "Paramètres manquants";
        else
        {
            $addParticipantIDArray = preg_split('/\r\n|\r|\n/', $addParticipantIDList);
            foreach($addParticipantIDArray as $participant)
            {
                $errorMessageTemp = addParticipant(trim($participant));
                $errorMessage .= empty($errorMessageTemp)?"":($errorMessageTemp."<br>\n");

            }
        }
        break;
    case "setParticipantIDStatus": //set a new status for a userID
        if(empty($participantID)||empty($newStatus))
            $errorMessage = "Paramètres manquants";
        else
        {
            $errorMessage = setParticipantStatus($participantID, $newStatus=="active"?1:0);
        }
        break;
    default: //unknown action
        $errorMessage = "Action inconnue";
        break;
}

?>

<!DOCTYPE html>
<html>
    <head>
    <meta charset='UTF-8'>
    <link href='css/backoffice.css' rel='stylesheet' type='text/css'>
    </head>
    <body>

<?php
 
echo backofficeMenu()."<br>\n";
 
/*********************/
/* Set userID status */
/*********************/
//error message
if($action=="setParticipantIDStatus" && !empty($errorMessage))
{
    echo "<p style='color:red'>".$errorMessage."</p>";
}

//display form
echo "<p>Modifier le status d'un participant.<br>\nChercher l'identifiant si dessous puis cliquer sur activer ou désactiver.<br>\n(les identifiants marqués avec '*' sont désactivés.</p>";
echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
        <input type='hidden' name='action' value='setParticipantIDStatus'>\n";
echo "<input list='participantIDlist' name='participantID' autocomplete='off'/><br>\n";
echo "<datalist id='participantIDlist'>\n";
//get participantList
$participantList = getParticipantList();
foreach($participantList as $participant)
{
    echo "<option value='".$participant["participantID"]."'>".$participant["participantID"].($participant["active"]==true?"":" *")."</option>\n";
}
echo "</datalist>\n";
echo "<button name='newStatus' value='active'>Activer</buton>";
echo "<button name='newStatus' value='inactive'>Désactiver</button>";
echo "</form>\n";

/*********************/
?>
<hr>
<?php
/**************************/
/* Add participantID List */
/**************************/
//error message
if($action=="addParticipants" && !empty($errorMessage))
{
    echo "<p style='color:red'>".$errorMessage."</p>";
}

//display form
echo "<p>Ajouter des identifiants (1 identifiant par ligne)</p>";
echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
        <input type='hidden' name='action' value='addParticipants'>\n";

echo "<textarea name='addParticipantIDList' cols='25'></textarea><br>\n";

echo "<button name='submit' value='add'>Ajouter</button>\n";
echo "</form>\n";

/**************************/

?>

    </body>
</html>

<?php
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
