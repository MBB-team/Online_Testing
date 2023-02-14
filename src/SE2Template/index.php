<?php
include('../portailLib/session.php');

if(isIdentified())
{
    //start run
    $run = prepareTask("SE2Template"); //modify this with taskID
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
    include('experiment_SE2Template.php');  //modify this according to task html file name
}
else
{
    //redirect to homepage
    header('Location: /');
    exit();
}


?>
