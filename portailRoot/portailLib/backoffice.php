<?php

function exportCSV($table, $onlyDone = false)
{
    $separator = "\t";

    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // Get all opened tasks
        $sql = "SELECT * FROM participant, run, taskSession, ".$table;
        $sql.= " WHERE runID=run_id AND participantID=participant_participantID AND taskSessionID=taskSession_taskSessionID";
        //if $taskID is supplied. Filter only this task
        if($onlyDone)
        {
            $sql.=" AND 'doneTime' IS NOT NULL";
        }
        $exportStmt = $conn->prepare($sql);

        $exportStmt->execute();
        if(!$exportStmt->execute())
        { //fail
            echo 'Something went wrong. Check table name.';
            exit();
        }

        $exportSQL = $exportStmt->fetchAll();

        if(count($exportSQL)<=0)
        { //no data
            echo 'Empty result :(';
            exit();
        }

        $csvExport = "";
        
        //csv header
        $columns = array();
        foreach($exportSQL[0] as $columnName=>$val)
        {
            //skip numeric alias of columns name
            if(is_numeric($columnName))
            {
                continue;
            }
            array_push($columns, $columnName);
            $csvExport.=$columnName.$separator;
        }
        $csvExport.="\n";
        
        //append all lines
        foreach($exportSQL as $exportLine)
        {
            foreach($columns as $column)
            {
                if(isset($exportLine[$column]))
                {
                    $csvExport.=$exportLine[$column];
                }
                $csvExport.=$separator;
            }
            $csvExport.="\n";
        }

        header("Content-type: text/x-csv");
        header("Content-Disposition: attachment; filename=\"export_".$table.".csv\"");
        echo($csvExport);

    }
    catch(PDOException $e)
    {
        $openedTasks = array(); //clear array before continue
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}


function backofficeOpenDataBase()
{
    // this path should point to your configuration file.
    include('database_config_session.php');
    //connect and set charset to utf8
    $_conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
    $_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $_conn;
}
?>