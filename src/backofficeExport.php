<?php

include('portailLib/backoffice.php');

$table = $onlyDone = $exportType = "";
//form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $table = test_input("table");
    $onlyDone = test_input("onlyDone");
    $exportType = test_input("exportType");
}


$errorMessage = "";

if($table!="")
{
    //export CSV
    switch($exportType)
    {
        case "simple":
            $errorMessage = exportCSVSimpleTable($table);
            break;
        case "joined":
            $errorMessage = exportCSVJoinedTable($table, $onlyDone=="true");
            break;
    }

}



    //display form
    echo "<!DOCTYPE html>
    <html>
        <head>
        <meta charset='UTF-8'>
        </head>
        <body>
        <a href='backofficeDashboard.php'>Tableau de bord</a><br>";

    if($errorMessage!="")
    {
        echo "<p style='color:red'>".$errorMessage."</p>";
    }

    //simple export
    echo "<p>Export d'une table</p>";
    echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
        <input type='hidden' name='exportType' value='simple'>
        <p>Table à exporter : ";

    displayDropDownList('table', getAllTables());
    echo "</p>";
    echo "<input type='submit' value='Exporter'>
    </form>";

    echo "<br><br>";

    //joined dataTask export
    echo "<p>Export des données pour une tâche (table de la tâche + taskSession + run)</p>";
    echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>
        <input type='hidden' name='exportType' value='joined'>
        <p>Table de tâche à exporter : ";

    displayDropDownList('table', getDataTaskTables());
    echo "</p>
        <p>Exclure les run incomplets : <input type='checkbox' name='onlyDone' value='true'></p>
        <input type='submit' value='Exporter'>
        </form>";

    echo '</body>
    </html>';

// display a dropdown list from array
// if array's key is a string, use it as label 
function displayDropDownList($fieldName, $items)
{
    echo "<select name='".$fieldName."'>\n";
    foreach($items as $key => $item)
    {
        echo "<option value='".$item."'>";
        if(is_string($key))
            echo $key;
        else
            echo $item;
        echo "</option>\n";
    }
    echo "</select>\n";
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