<?php
include('../portailLib/session.php');

if(isIdentified())
{
    //start run
    $run = prepareTask("SE3"); //modify this with taskID
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
    $clientIds["sessionName"] = $run["sessionName"];
    //Load task
    include('experimentS1_SE3Template.php');  //modify this according to task html file name
}
else
{
    //redirect to homepage
    header('Location: /');
    exit();
}


?>
