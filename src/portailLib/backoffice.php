<?php
//check auth
backofficeAuth();


//digest HTTP auth. Die if fail
function backofficeAuth()
{
    // source : www.php.net/manual/en/features.http-auth.php
    //read secrets
    if ( (!include('backofficeSecrets.php')) ||
         (!isset($backofficeUsers)) ||
         (count($backofficeUsers) < 1) )
        die('Please set secrets');

    $realm = "MBBsondageBackOffice";

    if (empty($_SERVER['PHP_AUTH_DIGEST']))
    {
        header('HTTP/1.1 401 Unauthorized');
        header('WWW-Authenticate: Digest realm="'.$realm.
               '",qop="auth",nonce="'.uniqid().'",opaque="'.md5($realm).'"');
    
        die('Vous devez être authentifié');
    }
    // analyze the PHP_AUTH_DIGEST variable
    if ( !($data = http_digest_parse($_SERVER['PHP_AUTH_DIGEST'])) ||
         !isset($backofficeUsers[$data['username']]))
        die('Erreur d\'authentification');

    // generate the valid response
    $A1 = md5($data['username'] . ':' . $realm . ':' . $backofficeUsers[$data['username']]);
    $A2 = md5($_SERVER['REQUEST_METHOD'].':'.$data['uri']);
    $valid_response = md5($A1.':'.$data['nonce'].':'.$data['nc'].':'.$data['cnonce'].':'.$data['qop'].':'.$A2);

    if ($data['response'] != $valid_response)
        die('Erreur d\'authentification');

    // ok, valid username & password
    // let's continue
}

// function to parse the http auth header
function http_digest_parse($txt)
{
    // protect against missing data
    $needed_parts = array('nonce'=>1, 'nc'=>1, 'cnonce'=>1, 'qop'=>1, 'username'=>1, 'uri'=>1, 'response'=>1);
    $data = array();
    $keys = implode('|', array_keys($needed_parts));

    preg_match_all('@(' . $keys . ')=(?:([\'"])([^\2]+?)\2|([^\s,]+))@', $txt, $matches, PREG_SET_ORDER);

    foreach ($matches as $m)
    {
        $data[$m[1]] = $m[3] ? $m[3] : $m[4];
        unset($needed_parts[$m[1]]);
    }

    return $needed_parts ? false : $data;
}



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

//return an array taskName=>dataTableName  
function getDataTaskTables()
{
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // Get all tables in database
        $sql = "SELECT taskName, dataTableName from task ";
        $sql.= "WHERE dataTableName IS NOT NULL";
        $tablesListStmt = $conn->prepare($sql);

        $tablesListStmt->execute();

        $tablesFetch = $tablesListStmt->fetchAll(PDO::FETCH_ASSOC);
        $tablesList = array();

        // parse each line to form a simpler array taskName=>dataTableName
        foreach($tablesFetch as $table)
        {
            $tablesList[$table['taskName']] = $table['dataTableName'];
        }
        return $tablesList;
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}

// Return an array of all tables
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