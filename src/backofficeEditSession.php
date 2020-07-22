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

    //check overlap
    if( isNewSessionOverlap($sessionInfo["task_taskID"],
                            $editOpeningDate." ".$editOpeningHour,
                            $editClosingDate." ".$editClosingHour,
                            getAllTaskSessions($sessionInfo["task_taskID"]),
                            $sessionInfo["sessionName"] ) )
        return "Une session existe déjà pour cette tâche à cette période";

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

// $taskID : array to add session for multiple task with same parameters
// $sessionName["taskID"] must match
function doAddSession($taskID, $sessionName, $editOpeningDate, $editOpeningHour, $editClosingDate, $editClosingHour)
{
    if(empty($taskID) || empty($sessionName) || empty($editOpeningDate) || empty($editOpeningHour) || empty($editClosingDate) || empty($editClosingHour))
        return "Paramètres manquants";
    
    $tasksInfo = getDataTaskTables();
    $errorMessage = "";
    //check taskID exist in data base then check if sessionName is supplied
    foreach($taskID as $taskIDelem)
    {
        $foundFlag = false;
        foreach($tasksInfo as $taskInfo)
        {
            if(strtoupper($taskInfo["taskID"])==strtoupper($taskIDelem))
            {
                $foundFlag = true;
            }
        }
        
        if($foundFlag == false)
        {
            $errorMessage .= $taskIDelem . " : Tâche inconnue.\\n";
            continue;
        }

        if(!array_key_exists($taskIDelem, $sessionName))
        {
            $errorMessage .= $taskIDelem . " : Pas de nom de session.\\n";
            continue;
        }

        if(empty($sessionName[$taskIDelem]))
        {
            $errorMessage .= $taskIDelem . " : Nom de session vide.\\n";
            continue;
        }
    }

    if(!empty($errorMessage))
        return $errorMessage .= "Aucune session n'a été ajoutée.";
        
    $newOpeningTime = strtotime($editOpeningDate." ".$editOpeningHour);
    $newClosingTime = strtotime($editClosingDate." ".$editClosingHour);
    $now = strtotime("now");


    if($newClosingTime < $newOpeningTime)
        return "La fermeture doit être posterieure l'ouverture";

    if($newClosingTime < $now)
        return "Les dates doivent être dans le futur";

    if($newOpeningTime < $now)
        return "Les dates doivent être dans le futur";

    $existingSessions = getAllTaskSessions();
    
    $errorMessage = "";
    //check session name
    foreach($taskID as $taskIDelem)
    {
        if( isSessionNameExist($sessionName[$taskIDelem], $existingSessions))
            $errorMessage .= $taskIDelem . " : Une session " . $sessionName[$taskIDelem] . " existe déjà.\\n";
    }

    if(!empty($errorMessage))
        return $errorMessage .= "Aucune session n'a été ajoutée.";

    $errorMessage = "";
    //check overlap
    foreach($taskID as $taskIDelem)
    {
        if( isNewSessionOverlap($taskIDelem,
                                $editOpeningDate." ".$editOpeningHour,
                                $editClosingDate." ".$editClosingHour,
                                $existingSessions ) )
            $errorMessage .= $taskIDelem . " : Une session existe déjà pour cette période.\\n";
    }

    if(!empty($errorMessage))
        return $errorMessage .= "Aucune session n'a été ajoutée.";

    foreach($taskID as $taskIDelem)
    {
        addSession($taskIDelem, $sessionName[$taskIDelem], $editOpeningDate." ".$editOpeningHour, $editClosingDate." ".$editClosingHour);
    }

    return "";
}

//return true if session Name already exist
//$sessionName : name of session to check
//$sessionsInDatabase : all sessions in database (use getAllTaskSessions() )
function isSessionNameExist($sessionName, $sessionsInDatabase)
{
    foreach($sessionsInDatabase as $sessionInDatabase)
    {
        if(strtoupper($sessionName) == strtoupper($sessionInDatabase["sessionName"]))
            return true;
    }
    return false;
}

//return true if session overlap an existing session of same task
//$taskID : check for this task 
//$openingTimeStr, $closingTime : period to test. Format "AAAA-MM-DD HH:MM:SS" (seconds can be omited)
//$sessionsInDatabase : all sessions in database (use getAllTaskSessions() )
//$excludeSessionName : exclude this session Name (used to check overlap on other session but itself when editing existing session)
function isNewSessionOverlap($taskID, $openingTimeStr, $closingTimeStr, $sessionsInDatabase, $excludeSessionName = "")
{
    $openingTime = strtotime($openingTimeStr);
    $closingTime = strtotime($closingTimeStr);
    foreach($sessionsInDatabase as $sessionInDatabase)
    {
        if(strtoupper($taskID) != strtoupper($sessionInDatabase["task_taskID"])) //not same task
            continue;

        if( (!empty($excludeSessionName)) && (strtoupper($excludeSessionName) == strtoupper($sessionInDatabase["sessionName"])) ) //don't check to self
        {
            continue;
        }

        $refOpeningTime = strtotime($sessionInDatabase["openingTime"]);
        $refClosingTime = strtotime($sessionInDatabase["closingTime"]);
        if(     ($refOpeningTime <= $openingTime && $openingTime <= $refClosingTime) || //opening time is in an existing session
                ($refOpeningTime <= $closingTime && $closingTime <= $refClosingTime) || //closing time is in an existing session
                ($openingTime <= $refOpeningTime && $refOpeningTime <= $closingTime) || //existing session opening time is in tested session period
                ($openingTime <= $refClosingTime && $refClosingTime <= $closingTime) ) //existing session closing time is in tested session period
        {
            return true;
        }
    }
    return false;
}

function test_input($data) {
    //return content of $_POST["$data"] with a bit of security
    //return empty string if $data is not found in $_POST
    if(!array_key_exists($data, $_POST))
    { return "";}

    $returnData = "";
    if(is_array($_POST["$data"]))
    {
        $returnData = array();
        foreach($_POST["$data"] as $key => $val)
        {
            $returnData[$key] = trim($val);
            $returnData[$key] = stripslashes($returnData[$key]);
            $returnData[$key] = htmlspecialchars($returnData[$key]);
        }
    }
    else
    {
        $returnData = trim($_POST["$data"]);
        $returnData = stripslashes($returnData);
        $returnData = htmlspecialchars($returnData);
    }
    return $returnData;
  }
?>