<?php

include('portailLib/backoffice.php');

$editType = $sessionID = $editOpeningDate = $editOpeningHour = $editClosingDate = $editClosingHour = $taskID = $sessionName = "";
//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $editType = test_input("editType");
    $sessionID = test_input("sessionID");         //values : "true", "false"
    $editOpeningDate = test_input("editOpeningDate");     //values : "simple", "joined"
    $editOpeningHour = test_input("editOpeningHour");   //values : "All", "One" 
    $editClosingDate = test_input("editClosingDate");
    $editClosingHour = test_input("editClosingHour");
    $taskID = test_input("taskID");
    $sessionName = test_input("sessionName");
}

$errorMessage = "";

switch($editType)
{
    case "editSession":
        $errorMessage = doEditSession($sessionID, $editOpeningDate, $editOpeningHour, $editClosingDate, $editClosingHour);
        break;
    case "addSession":
        $errorMessage = doAddSession($taskID, $sessionName, $editOpeningDate, $editOpeningHour, $editClosingDate, $editClosingHour);
        break;
    default:
        $errorMessage = "Commande inconnue";
    break;
}

if(!empty($errorMessage))
{
    echo '{"success": false, "message": "'.$errorMessage.'"}';
}
else
{
    echo '{"success": true, "message": "'.$errorMessage.'"}';
}

function doEditSession($sessionID, $editOpeningDate, $editOpeningHour, $editClosingDate, $editClosingHour)
{
    if(empty($sessionID))
        return "Paramètres manquants";
        
    $sessionInfo = getSession($sessionID);
    if($sessionInfo==null)
        return "Session non trouvées";
    //var_dump($sessionInfo);

    $openingTime = strtotime($sessionInfo["openingTime"]);
    $closingTime = strtotime($sessionInfo["closingTime"]);
    $newOpeningTime = strtotime($editOpeningDate." ".$editOpeningHour);
    $newClosingTime = strtotime($editClosingDate." ".$editClosingHour);
    $now = strtotime("now");

    if($newClosingTime < $newOpeningTime)
        return "La fermeture doit être posterieure l'ouverture";

    if($closingTime < $now) //already close
        return "Session déjà fermée";

    if($newClosingTime < $now) //new past closing date
        return "Les nouvelles dates doivent être dans le futur";

    //Update closingTime
    if(!(updateSessionClosingTime($sessionID, $editClosingDate." ".$editClosingHour)))
        return "erreur SQL";

    if($openingTime < $now) //already opened
        return ""; //no modification but no error
    if($newOpeningTime < $now)
        return "Les nouvelles dates doivent être dans le futur";

    //Update openingTime
    if(!(updateSessionOpeningTime($sessionID, $editOpeningDate." ".$editOpeningHour)))
        return "erreur SQL";

    return "";
}

//todo: $taskID might be an array to add session for multiple task with same parameters
// $sessionName must match
function doAddSession($taskID, $sessionName, $editOpeningDate, $editOpeningHour, $editClosingDate, $editClosingHour)
{
    if(empty($taskID) || empty($sessionName) || empty($editOpeningDate) || empty($editOpeningHour) || empty($editClosingDate) || empty($editClosingHour))
        return "Paramètres manquants";
    
    $taskInfo = getDataTaskTables($taskID);
    if(empty($taskInfo))
        return "taskID inconnu";
        
    $newOpeningTime = strtotime($editOpeningDate." ".$editOpeningHour);
    $newClosingTime = strtotime($editClosingDate." ".$editClosingHour);
    $now = strtotime("now");


    if($newClosingTime < $newOpeningTime)
        return "La fermeture doit être posterieure l'ouverture";

    if($newClosingTime < $now)
        return "Les dates doivent être dans le futur";

    if($newOpeningTime < $now)
        return "Les dates doivent être dans le futur";

    //todo: more checking (overlaping session)

    addSession($taskID, $sessionName, $editOpeningDate." ".$editOpeningHour, $editClosingDate." ".$editClosingHour);

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