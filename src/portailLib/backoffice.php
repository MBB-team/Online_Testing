<?php

// If no error, echo a CSV file for one table if no error.
// Else return an error string.
function exportCSVSimpleTable($table)
{
    //check if table exist
    if(!in_array($table, getAllTables()))
        return $table." n'existe pas dans la base de données";

    //SQL request for one table
    $sql = "SELECT * FROM ".$table;
    return exportCSV($sql, $table."_".date('Y-m-d_H-i-s'));
}

// If no error, echo a CSV file for a data task table joined with run and taskSession if no error.
// Else return an error string.
function exportCSVJoinedTable($table, $onlyDone=false)
{
    //check if table is a data task table
    if(!in_array($table, getDataTaskTables()))
        return $table." n'existe pas dans la base de données";
    //SQL request for this table joined with run and taskSession
    $sql = "SELECT * FROM run, taskSession, ".$table;
    $sql.= " WHERE runID=run_id AND taskSessionID=taskSession_taskSessionID";
    //if $onlyDone. Filter only done run
    if($onlyDone)
    {
        $sql.=" AND 'doneTime' IS NOT NULL";
    }
    return exportCSV($sql, $table."_joined"."_".date('Y-m-d_H-i-s'));
}

// subfunction to export CSV.
// actually do the SQL request and form the CSV file
// If error return a string error.
function exportCSV($sql, $csvFilename="export")
{
    $separator = "\t";

    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        $exportStmt = $conn->prepare($sql);

        $exportStmt->execute();
        if(!$exportStmt->execute())
        { //fail
            return 'Something went wrong. Check table name.';
        }

        $exportSQL = $exportStmt->fetchAll();

        if(count($exportSQL)<=0)
        { //no data
            return 'Empty result';
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
        header("Content-Disposition: attachment; filename=\"".$csvFilename.".csv\"");
        echo($csvExport);
        exit();

    }
    catch(PDOException $e)
    {
        $openedTasks = array(); //clear array before continue
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}

//return names of tables containing tasks data 
function getDataTaskTables()
{
    //Note : Might be better and flexible to add a field in task with the associated data table name

    $tableList = array( "table_DPD",
                        "tableSE",
                        "tableQuest",
                        "tableEmo",
                        "tableConstance"
                      );
    return $tableList;
}

function getAllTables()
{
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // Get all tables in database
        $sql = "SHOW TABLES";
        $tablesListStmt = $conn->prepare($sql);

        $tablesListStmt->execute();

        $tablesFetch = $tablesListStmt->fetchAll(PDO::FETCH_NUM);

        $tablesList = array();

        //parse each line to form a simpler array
        foreach($tablesFetch as $table)
        {
            array_push($tablesList,$table[0]);
        }
        return $tablesList;
    }
    catch(PDOException $e)
    {
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