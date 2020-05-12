<?php
include('../portailLib/session.php');

if(!isIdentified() || !isPreparedTask())
{   //not identified or no run started in this session environement.
    
    echo '{"success": false}';
}

//update database
if(endTask())
{
    echo '{"success": true}';
}
else
{
    echo '{"success": false}';
}

?>