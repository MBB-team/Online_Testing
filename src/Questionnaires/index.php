<?php
include('../portailLib/session.php');

if(isIdentified() && isPreparedTask())
{
    //Load task
    include('questionnaires.html');  //modify this according to task html file name
}
else
{
    //redirect to homepage
    header('/');
    exit();
}


?>
