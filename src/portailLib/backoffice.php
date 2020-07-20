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
    if(!isTableInArray($table, getAllTables()))
        return $table." n'existe pas dans la base de données";

    //SQL request for one table
    $sql = "SELECT * FROM ".$table;
    return exportCSV($sql, $table."_".date('Y-m-d_H-i-s'));
}

// If no error, echo a CSV file for a data task table joined with run and taskSession if no error.
// Else return an error string.
function exportCSVJoinedTable($table, $onlyDone=false, $sessionID="")
{
    //check if table is a data task table
    if(!isTableInArray($table, getDataTaskTables()))
        return $table." n'existe pas dans la base de données";
    //SQL request for this table joined with run and taskSession
    $sql = "SELECT * FROM run, taskSession, ".$table;
    $sql.= " WHERE runID=run_id AND taskSessionID=taskSession_taskSessionID";

    //if sessionID supplied, select only this session
    if(!empty($sessionID))
    {
        $sql.= " AND taskSessionID='".$sessionID."'";
    }
    //if $onlyDone. Filter only done run
    if($onlyDone)
    {
        $sql.=" AND 'doneTime' IS NOT NULL";
    }
    $filename = $table."_joined";
    $filename.=(empty($sessionID))?("_allSessions"):("_".getSessionName($sessionID));
    $filename.= "_".date('Y-m-d_H-i-s');
    return exportCSV($sql, $filename);
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

//return an array taskName=>['dataTableName','taskID']
//limit to $taskID if submited 
function getDataTaskTables($taskID="")
{
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // Get all tables in database
        $sql = "SELECT taskName, dataTableName, taskID from task ";
        $sql.= "WHERE dataTableName IS NOT NULL";
        $sql.= ((empty($taskID))?"":(" AND taskID='".$taskID."'"));
        $tablesListStmt = $conn->prepare($sql);

        $tablesListStmt->execute();

        $tablesFetch = $tablesListStmt->fetchAll(PDO::FETCH_ASSOC);
        $tablesList = [];

        // parse each line to form a simpler array taskName=>'dataTableName','taskID'
        foreach($tablesFetch as $table)
        {
            $task = [];
            $task['dataTableName'] = $table['dataTableName'];
            $task['taskID'] = $table['taskID'];
            $tablesList[$table['taskName']] = $task;
        }
        return $tablesList;
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}

// Return an array of all tables n=>['dataTableName']
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

        $tablesList = [];

        //parse each line to form a simpler array n=>['dataTableName']
        foreach($tablesFetch as $table)
        {
            $tableObj = [];
            $tableObj['dataTableName'] = $table[0];
            array_push($tablesList,$tableObj);
        }
        return $tablesList;
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }

}

// return task(s) sessions ordered by task ID and by openning time  
// only for $taskID, if is supplied 
function getAllTaskSessions($taskID="")
{
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // Get task session
        $sql = "SELECT * from taskSession";
        //filter by $taskID
        if($taskID!="")
            $sql.= " WHERE task_taskID='".$taskID."'";
        //order
        $sql.= " ORDER BY task_taskID, openingTime";

        $taskSessionStmt = $conn->prepare($sql);

        $taskSessionStmt->execute();

        $taskSessionFetch = $taskSessionStmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $taskSessionFetch;
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}

//return true if $tableName is found in the array returned by getAllTables() or getAllTaskSessions()
function isTableInArray($tableName, $tableArray)
{
    foreach($tableArray as $item)
    {
        if($item['dataTableName'] == $tableName)
            return true;
    }
    return false;
}

// return an array of number of user has done/started run ordered by taskSession
// $doneStatus = true :  count users with done run 
// $doneStatus = false : count users with started but not done run
// array format :
//      taskSessionID => runCount
function getRunCountByTaskSessions($status=true)
{
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // Get run Count
        $sql = "SELECT COUNT(*) AS runCount, t.taskSessionID as taskSessionID
        FROM (
        SELECT participant_participantID AS participantID, MAX(doneTime) AS doneTime, taskSession_taskSessionID as taskSessionID FROM `run` GROUP BY participant_participantID, taskSession_taskSessionID
        ) AS t
        WHERE t.doneTime IS " . ($status?"NOT ":" ") . "NULL GROUP BY t.taskSessionID";

        $countRunStmt = $conn->prepare($sql);

        $countRunStmt->execute();

        $countRuns = $countRunStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $taskSessionRunCount = array();
        foreach($countRuns as $countRun)
        {
            $taskSessionRunCount[$countRun['taskSessionID']] = $countRun['runCount'];
        }

        return $taskSessionRunCount;
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}

function getSessionName($sessionID)
{
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // Get sessionName
        $sql = "SELECT sessionName FROM taskSession WHERE taskSessionID = ".$sessionID;

        $sessionNameStmt = $conn->prepare($sql);
        $sessionNameStmt->execute();
        $sessionName = $sessionNameStmt->fetchColumn();

        return $sessionName;
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}

function getSession($sessionID)
{
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // Get sessionName
        $sql = "SELECT * FROM taskSession WHERE taskSessionID = ".$sessionID;

        $sessionStmt = $conn->prepare($sql);
        $sessionStmt->execute();
        $sessionFetch = $sessionStmt->fetchAll(PDO::FETCH_ASSOC);

        if($sessionFetch==null || count($sessionFetch)!=1)
            return null;
        return $sessionFetch[0];
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}

function addSession($taskID, $sessionName, $openingTime, $closingTime)
{
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // addSession 
        $sql = "INSERT INTO taskSession (taskSessionID, sessionName, openingTime, closingTime, task_taskID) VALUES (NULL, '".$sessionName."', '".$openingTime."', '".$closingTime."', '".$taskID."')";

        $addSessionStmt = $conn->prepare($sql);

        $addSessionSucces = $addSessionStmt->execute();

        return $addSessionSucces;
    }
    catch(PDOException $e)
    {
        
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return false;
    }
}

function updateSessionOpeningTime($sessionID, $newTime)
{
    return _updateSessionTime($sessionID, $newTime, "openingTime");
}

function updateSessionClosingTime($sessionID, $newTime)
{
    return _updateSessionTime($sessionID, $newTime, "closingTime");
}

//return true if succeded
function _updateSessionTime($sessionID, $newTime, $field)
{
    if($field!="openingTime" && $field!="closingTime")
    {
        return false;
    }
    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // update run with doneTime
        $sql = "UPDATE taskSession SET ".$field."='".$newTime."' WHERE taskSessionID='".$sessionID."'";

        $updateSessionStmt = $conn->prepare($sql);

        $updateSessionSucces = $updateSessionStmt->execute();

        return $updateSessionSucces;
    }
    catch(PDOException $e)
    {
        
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return false;
    }

}

//get participant list
function getParticipantList()
{
    try {
        // connect to database
        $conn = backofficeOpenDataBase();

        $sql = "SELECT * FROM participant";
        $getParticpantStmt = $conn->prepare($sql);

        $getParticpantStmt->execute();
        $getParticpantResult = $getParticpantStmt->fetchAll(PDO::FETCH_ASSOC);
        return $getParticpantResult;
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return null;
    }
    $conn = null;
}

//set participant status
//$newstatus = 1 : activate participant
//$newstatus = 1 : deactivate participant
function setParticipantStatus($participantID, $newStatus)
{
    //check participant ID
    $participantList = getParticipantList();
    if($participantList == null)
        return "Erreur SQL";
    if(empty($participantList))
        return "Identifiant non trouvé.";

    $flagfound = false;
    foreach($participantList as $participant)
    {
        if($participant["participantID"] == $participantID)
        {
            $flagfound = true;
            break;
        }
    }
    if(!$flagfound)
        return "Identifiant non trouvé.";

    //$participantID found in databasse
    try {
        // connect to database
        $conn = backofficeOpenDataBase();

        $sql = "UPDATE participant SET active=$newStatus WHERE participantID='".$participantID."'";
        $setParticpantStatusStmt = $conn->prepare($sql);

        $setParticipantStatusSuccess = $setParticpantStatusStmt->execute();
        if(!$setParticipantStatusSuccess)
            return "Erreur SQL";
        else
            return "";
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return "Erreur SQL";
    }
    $conn = null;
}

//return empty string on success else errorMessage
function addParticipant($participantID)
{
    //check participant ID
    $participantList = getParticipantList();
    if($participantList == null)
        return "Erreur SQL";

    $flagfound = false;
    foreach($participantList as $participant)
    {
        if($participant["participantID"] == $participantID)
        {
            $flagfound = true;
            break;
        }
    }
    if($flagfound)
        return "Identifiant ".$participantID." déjà dans la base.";

    try {

        // connect to database
        $conn = backofficeOpenDataBase();

        // addSession 
        $sql = "INSERT INTO participant (participantID, active) VALUES ('".$participantID."', '1')";

        $addParticipantStmt = $conn->prepare($sql);

        $addParticipantuccess = $addParticipantStmt->execute();

        return "";
    }
    catch(PDOException $e)
    {
        
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return "Erreur SQL";
    }
}

//return html menu of all the backoffice page
function backofficeMenu()
{
    $backofficePages = Array(   '/backofficeExport.php' => "Exporter des données",
                                '/backofficeDashboard.php' => "Tableau de bord",
                                '/backofficeUserManagement.php' => "Gestion des participants",
                            );
    $menuString = "";
    foreach($backofficePages as $address => $title)
    {
        if(!empty($menuString))
            $menuString .= " | "; //add a serparator

        if(htmlspecialchars($_SERVER["PHP_SELF"])==$address)
            $menuString .= "<b>".$title."</b>";
        else
            $menuString .= "<a href='".$address."'>".$title."</a>";
    }

    return $menuString;
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