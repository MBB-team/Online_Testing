<?php

include('portailLib/backoffice.php');

$table = $onlyDone = "";
//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $table = test_input("table");
    $onlyDone = test_input("onlyDone");
}

if($table!="")
{
    //export CSV
    exportCSV($table, $onlyDone=="true");
    exit();
}
else
{
    //display form
    echo '<!DOCTYPE html>
    <html>
        <head>
        <meta charset="UTF-8">
        </head>
        <body>';

    echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
        <p>Table à exporter : <input type='input' name='table'></p>
        <p>Exclure les run incomplets : <input type='checkbox' name='onlyDone' value='true'></p>
        <input type='submit' value='Exporter'>
        </form>";

    echo '</body>
    </html>';
}

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