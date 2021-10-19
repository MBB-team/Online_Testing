<?php
include('../portailLib/session.php');

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