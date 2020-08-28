<?php

include('portailLib/backoffice.php');

$action = $taskID = $runID = $matchedRunID = $participantID = "";
//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = test_input("action");         //values : "check", "exportOriginal, exportCorrected"
    $taskID = test_input("taskID");         //values : working on this taskID
    $runID = test_input("runID");           //values : original runID to export
    $matchedRunID = test_input("matchedRunID");           //values : original runID to export
    $participantID = test_input("participantID");           //values : participantID 
}

$result = array(); // contin data to be returned
$result['message'] = "";

switch($action)
{
    case "check":
        $result['message'] = 'Vérification pour la tâche '. $taskID;
        $result['data'] = getUnlinkedDataSummary($taskID);
        $result['taskID'] = $taskID;
        break;
    case "exportOriginal":
        $errorMessage = exportCSVrawRun($participantID, $runID, $taskID); //if it worked, stop here
        $result['message'] = 'Export Raw"'. $participantID . ' '. $taskID . ' ' . $runID . ' -- ' . $errorMessage; 
        break;
    case "exportCorrected":
        $errorMessage = exportCSVcorrectedRun($participantID, $runID, $taskID, $matchedRunID); //if it worked, stop here
        $result['message'] = 'Export corrected "'. $participantID . ' '. $taskID . ' ' . $runID . '->' . $matchedRunID . ' -- ' . $errorMessage; //replace by export csv
        break;
    default:
        $result['message'] = 'Commande "'. $action .'" inconnue';
    break;
}

echo json_encode($result);

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