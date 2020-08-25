<?php

include('portailLib/backoffice.php');

$action = $taskID = $runID = "";
//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = test_input("action");         //values : "check", "export"
    $taskID = test_input("taskID");         //values : working on this taskID
    $runID = test_input("runID");           //values : original runID to export
}

$result = array(); // contin data to be returned
$result['message'] = "";

switch($action)
{
    case "check":
        $result['message'] = 'check "'. $taskID;
        break;
    case "export":
        $result['message'] = 'Export "'. $taskID . ' ' . $runID;
        break;
    default:
        $result['message'] = 'Commande "'. $action .'" inconnue';
    break;
}

echo json_encode($result);

?>