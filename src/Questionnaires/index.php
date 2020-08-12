<?php
include('../portailLib/session.php');

if(isIdentified() && isPreparedTask())
{
    //get ids
    $clientIds=[];
    $clientIds["participantID"] = getParticipantID();
    $clientIds["runID"] = getRunID();
    //Load task
    include('questionnaires.php');  //modify this according to task html file name
}
else
{
    //redirect to homepage
    header('/');
    exit();
}


?>
