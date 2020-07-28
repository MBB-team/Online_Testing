<?php

include('portailLib/backoffice.php');
?>
<!DOCTYPE html>
    <html>
        <head>
        <meta charset='UTF-8'>
        <link href='css/backoffice.css' rel='stylesheet' type='text/css'>
        </head>
        <body>

<?php
echo backofficeMenu()."<br>\n";
?>
<br>
<div id='diskUsage'>
Espace disque utilisé par chaque table :<br><br>
<?php
$diskUsage = getTablesdiskUsage();
if(!$diskUsage)
    echo 'Pas d\'informations obtenue.<br>\n';
else
{
?>
<table>
<COL span=1 >
<COL span=1 width=300px>
<tr><th>Table</th><th>Taille</th></tr>
<?php
$totalDiskUsage = 0;
foreach($diskUsage as $diskUsageElem)
{
    $totalDiskUsage += floatval($diskUsageElem["table_size"]);
}

foreach($diskUsage as $diskUsageElem)
{
    $percent = number_format(100*floatval($diskUsageElem["table_size"])/$totalDiskUsage,1);
    echo '<tr><td>'.$diskUsageElem["table_name"].'</td><td style="background: linear-gradient( to right, #A0A0FF 0%, #A0A0FF '.$percent.'%, #FFFFFF '.$percent.'%, #FFFFFF 100%);">'.formatSizeUnits(floatval($diskUsageElem["table_size"]),'o')."</td></tr>\n";
}

echo '<tr style=\'font-weight:bold;\'><td>Total</td><td style="background: #A0A0FF;">'.formatSizeUnits($totalDiskUsage,'o')."</td></tr>\n";
?>

</table>
<?php
}
?>

</div>

</body>
</html>

<?php

function formatSizeUnits($bytes, $unitString = 'B')
{
    if ($bytes >= 1000000000)
    {
        $bytes = number_format($bytes / 1000000000, 2) . ' G' . $unitString;
    }
    elseif ($bytes >= 1000000)
    {
        $bytes = number_format($bytes / 1000000, 2) . ' M' . $unitString;
    }
    elseif ($bytes >= 1000)
    {
        $bytes = number_format($bytes / 1000, 2) . ' k' . $unitString;
    }
    elseif ($bytes > 0)
    {
        $bytes = $bytes . ' ' . $unitString;
    }
    else
    {
        $bytes = '0 ' . $unitString;
    }

    return $bytes;
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