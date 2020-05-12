<?php
include('../portailLib/session.php');

if(isIdentified() && isPreparedTask())
{
    //Load task
    include('experiment_Constance.html');  //modify this according to task html file name
}
else
{
    //redirect to homepage
    header('/');
    exit();
}


?>
