<?php
include('../portailLib/session.php');

if(isIdentified())
{
    //start run
    $run = prepareTask("CONST"); //modify this with taskID
    if(empty($run))
    {
        //redirect to homepage
        header('Location: /');
        exit();
    }
    //get ids
    $clientIds=[];
    $clientIds["participantID"] = $run["participantID"];
    $clientIds["runID"] = $run["runID"];
    $clientIds["runKey"] = $run["runKey"];
    //Load task
    include('experiment_Constance.php');  //modify this according to task html file name
}
else
{
    //redirect to homepage
    header('Location: /');
    exit();
}


?>
