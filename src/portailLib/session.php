<?php

session_name('onlinetesting');

session_start();


// return :
// - "success"          if successfully identified
// - "tooManyFails"     blacklisted
// - "inactiveUser"     if user exist but disabled
// - "unknownUser"      if user is not in database (also count as a failed attempt for requester IP)
// - "unknownError"     SQL error or incorrect datas in database (Request matched more than 1 user)

function identify($participantID)
{
    $maxAttemptByIP = 5;
    $periodAttemptByIP = 15; //minutes

    if(checkFailedAttemptIP($maxAttemptByIP,$periodAttemptByIP) != false) //check failed attempts
    {
        unset($_SESSION['participantID']); //clear in session
        return "tooManyFails"; //do not even try to login if banned IP
    }

    try {
        // connect to database
        $conn = sessionOpenDataBase();

        $sql = "SELECT participantID, active FROM participant WHERE participantID = '".$participantID."'";
        $sql .= " AND BINARY participantID = '".$participantID."'"; //case sensitive comparison
        $userInDatabaseStmt = $conn->prepare($sql);

        $userInDatabaseStmt->execute();
        $userInDatabaseFetch = $userInDatabaseStmt->fetchAll(PDO::FETCH_ASSOC);
        
        if(count($userInDatabaseFetch)==1) //found valid user ID
        {
            if($userInDatabaseFetch[0]['active']==1) //active user
            {
                $_SESSION['participantID'] = $participantID; //save in session
                cleanOldFailedAttemptIP($periodAttemptByIP);
                return "success";
            }
            else //inactive user
            {
                unIdentify(); //clear in session
                return "inactiveUser";
            }
        }
        else if(count($userInDatabaseFetch)==0)//not found
        {
            unIdentify(); //clear in session
            logFailedAttemptIP(); //log failed attempt remote IP
            return "unknownUser";
        }
        else //unknown error
        {
            unIdentify();
            return "unknownError";
        }
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return "unknownError";
    }
    $conn = null;
}

function isIdentified()
{
    if(array_key_exists('participantID', $_SESSION))
    {
        return(true);
    }
    else
    {
        return(false);
    }
}

function getParticipantID()
{
    if(array_key_exists('participantID', $_SESSION))
    {
        return($_SESSION['participantID']);
    }
    else
    {
        return("");
    }
}

function unIdentify()
{
    unset($_SESSION['participantID']); //clear userid in session
    //clearRunSession();
}

//get list of current opened tasks. Append a boolean "done" attribut to each task (true if user had already done the task).
function getAvailableTask($taskID="")
{
    $openedTasks = array();
    try {

        // connect to database
        $conn = sessionOpenDataBase();

        // Get all opened tasks
        $sql = "
            SELECT
                tsk.*,
                tsn.*
            FROM
                task tsk
            LEFT JOIN taskSession tsn ON tsn.task_taskID = tsk.taskID
            WHERE
                tsn.openingTime < ".phpNow()."
                AND tsn.closingTime > ".phpNow();

        //if $taskID is supplied. Filter only this task
        if($taskID!="")
            $sql.=" AND tsk.taskID = '". $taskID ."'";
        $sql .= " ORDER BY tsk.taskName ASC;";

        $openedTasksStmt = $conn->prepare($sql);
        $openedTasksStmt->execute();
        $openedTasks = $openedTasksStmt->fetchAll();

        //check if task already done
        foreach($openedTasks as $key=>$openedTask)
        {
            $sql = "SELECT COUNT(participant_participantID) FROM run WHERE taskSession_taskSessionID = ". $openedTask["taskSessionID"] ." AND participant_participantID = '". getParticipantID() ."' AND doneTime IS NOT NULL";

            $taskDoneStmt = $conn->prepare($sql);

            $taskDoneStmt->execute();
            if($taskDoneStmt->fetchColumn()>0)
            {
                $openedTasks[$key]["done"] = true;
            }
            else
            {
                $openedTasks[$key]["done"] = false;
            }
        }

    }
    catch(PDOException $e)
    {
        $openedTasks = array(); //clear array before continue
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
    

    $conn = null;
    return $openedTasks;
}

function getTaskUrl($taskID)
{
    if(!isset($taskID) || empty($taskID))
        return "";
    try {

        // connect to database
        $conn = sessionOpenDataBase();
        $sql = "SELECT url FROM task WHERE taskID = '" . $taskID . "'";
        $urlStmt = $conn->prepare($sql);
        
        if($urlStmt->execute())
            return $urlStmt->fetchColumn();
        else
            return "";
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return "";
    }
}

//if everything allright, add a line to run table, set Session variable and return an array with prepared task info. //otherwise return empty array
//$run["participantID"] 
//$run["runID"] 
//$run["taskID"] 
//$run["taskSessionID"] 
//$run["taskUrl"] 
//$run["runKey"]
function prepareTask($taskID) 
{
    //check if user can do the task
    $availableTasks = getAvailableTask($taskID);
    if(count($availableTasks)!=1) //assuming max one session can opened for one task at a time
    {
        //invalid task
        return([]);
    }
    if($availableTasks[0]["done"])
    {
        //task already done
        return([]);
    }

    try {

        // connect to database
        $conn = sessionOpenDataBase();

        // insert a new run
        $sql = "INSERT INTO run (startTime, participant_participantID, taskSession_taskSessionID) ";
        $sql.= "VALUES (".phpNow().",'".getParticipantID()."',".$availableTasks[0]["taskSessionID"].")";

        $addRunStmt = $conn->prepare($sql);

        $addRunStmt->execute();
        
        //Get runID
        $sql = "SELECT LAST_INSERT_ID()";
        $runIDStmt = $conn->prepare($sql);
        if($runIDStmt->execute())
        {
            $run = [];

            $run["participantID"] = getParticipantID();
            $run["runID"] = $runIDStmt->fetchColumn();
            $run["taskID"] = $taskID;
            $run["taskSessionID"] = $availableTasks[0]["taskSessionID"];
            $run["taskUrl"] = $availableTasks[0]["url"];

            //set runKey
            $runKey=null;
            $limitRetry = 50;
            while($limitRetry>0)
            {
                $runKey = strtolower(substr(md5($run["runID"] . '_' . rand()), 0, 8));
                $sql = "SELECT COUNT(runKey) FROM run WHERE runKey = '" . $runKey . "' ";
                $countRunKeyStmt = $conn->prepare($sql);
                $countRunKeyStmt->execute();

                if( $countRunKeyStmt->fetchColumn() == 0 ) 
                {
                    break; //found a unique runKey
                }
                $limitRetry--;
            }
            if($limitRetry<=0)
            {
                $runKey = null;
            }
            else
            {
                $sql = "UPDATE run SET runKey = '" . $runKey . "' WHERE runID = '" . $run["runID"] . "' ";
                $updateRunKeyStmt = $conn->prepare($sql);
                $success = $updateRunKeyStmt->execute();
                if(!$success)
                {
                    $runKey = null;
                }

            }
            $run["runKey"] = $runKey;

            
            
            return $run;
        }
        else
        {
            //clearRunSession();
            return [];
        }

    }
    catch(PDOException $e)
    {
        
        print "Erreur !:" . $e->getMessage() . "<br/>";
        //clearRunSession();
        return [];
    }

}
/*
function isPreparedTask()
{
    if(array_key_exists('runID', $_SESSION))
    {
        return(true);
    }
    else
    {
        return(false);
    }
}

function getRunID()
{
    if(array_key_exists('runID', $_SESSION))
    {
        return($_SESSION['runID']);
    }
    else
    {
        return("");
    }
}
*/
//update a run with doneTime to phpNow(), return true on success
function endTask()
{
    //if(!isPreparedTask())
    //{
    //    //no run started in this session environement
    //    return false;
    //}

    $data_all = array(); 
    try
    {
        $data_all = json_decode(file_get_contents('php://input'), true);
    }
    catch ( Exception $e)
    {
        $data_all = array(); // probably no data due to using old endTask call
    }

    $clientIds = array();
    //$result = array(); // will return if insert were succeded (1) or failed (0) or already saved (2) for each indexes

    foreach($data_all as $key => $data_array)
    {
        //expect no data exept clientIds

        if($key == 'clientIds')
        {
            //var_dump($data_array);
            foreach($data_array as $clientIdsKey => $clientIdsData)
            {
                $clientIds[$clientIdsKey] = htmlspecialchars($clientIdsData);
            }
            continue;
        }
    }
/*
    if(!isset($clientIds["runID"]) && isIdentified() && isPreparedTask()) // session fallback //todo: remove this ?
    {
        $clientIds["runID"] = getRunID();
        if(isset($_SESSION["runKey"]))
            $clientIds["runKey"] = $_SESSION["runKey"];
    }
    if(!isset($clientIds["runKey"]))
        $clientIds["runKey"] = null;
*/
    if(!isset($clientIds["runID"]))
        return false;

    try {
        // connect to database
        $conn = sessionOpenDataBase();

        //check if run is opened
        $sql = "SELECT count(*) FROM run WHERE runID='" . $clientIds["runID"] . "' AND doneTime IS NULL";
        if( is_null($clientIds["runKey"]) )
        {
            $sql.= " AND runKey IS NULL" ;
        }
        else
        {
            $sql.= " AND runKey='" . $clientIds["runKey"] . "'";
        }
        
        $CheckRunStmt = $conn->prepare($sql);
        $CheckRunStmt->execute();

        if($CheckRunStmt->fetchColumn() != 1) //run not fund
            return false;

        //update run with doneTime

        // update run with doneTime
        $sql = "UPDATE run SET doneTime=".phpNow()." WHERE runID='".$clientIds["runID"]."'";

        $addRunStmt = $conn->prepare($sql);

        $addRunSucces = $addRunStmt->execute();

        //todo: remove this clear?
        /*
        if($addRunSucces)
        {
            clearRunSession();
        }*/
        return $addRunSucces;
    }
    catch(PDOException $e)
    {
        
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return false;
    }

    
}
/*
//keep track of already saved data indexes to prevent save same data twice 
function logIndexSaved($index)
{
    if(!isset($_SESSION["indexesSaved"]))
        return;
    array_push($_SESSION["indexesSaved"], $index);
}

//return true if $index is already saved
function isIndexSaved($index)
{
    if(!isset($_SESSION["indexesSaved"]))
        return false;
    return in_array($index, $_SESSION["indexesSaved"]);
}
*/
// write samples (from php://input) in database table $table
// return an array
//  indexN => result
//  ...
//  'message' => error
//
// result   = 0 : failed
//          = 1 : saved
//          = 2 : already saved
// error : empty string or error message from PDO
function writeData($table)
{
    $data_all = json_decode(file_get_contents('php://input'), true);
    $clientIds = array();
    $result = array(); // will return if insert were succeded (1) or failed (0) or already saved (2) for each indexes
    foreach($data_all as $key => $data_array)
    {
        if(is_numeric($key)) //add index to $result array
        {
            $result[$key] = 0; //temporary mark as failed
            continue;
        }
        if($key == 'clientIds')
        {
            //var_dump($data_array);
            foreach($data_array as $clientIdsKey => $clientIdsData)
            {
                $clientIds[$clientIdsKey] = htmlspecialchars($clientIdsData);
            }
            continue;
        }
    }
    /*
    if(!isset($clientIds["runID"])) // session fallback
    {
        $clientIds["runID"] = getRunID();
        if(isset($_SESSION["runKey"]))
            $clientIds["runKey"] = $_SESSION["runKey"];
    }
    */
    if(!isset($clientIds["runKey"]))
        $clientIds["runKey"] = null;

    $result['message']="";

    try {
        $conn = sessionOpenDataBase();

        // First stage is to get all column names from the table and store them in $col_names array.
        $stmt = $conn->prepare("SHOW COLUMNS FROM `$table`");
        $stmt->execute();
        $col_names = array();
        while($row = $stmt->fetchColumn())
        {
            $col_names[] = $row;
        }
        // Second stage is to create prepared SQL statement using the column
        // names as a guide to what values might be in the JSON.

        foreach($data_all as $key => $data_json)
        {
            if( !is_numeric($key) ) //skip non data
            {
                continue;
            }
            //disable this feature
            //if( isIndexSaved($key) ) //already saved
            //{
            //$result[$key] = 2; //mark as already saved
            //continue;
            //}

            $data_array = json_decode($data_json, true);
            // If a value is missing from a particular trial, then NULL is inserted
            $sql = "INSERT INTO $table VALUES(";
            for($i = 0; $i < count($col_names); $i++){
                $name = $col_names[$i];
                $sql .= ":$name";
                if($i != count($col_names)-1){
                    $sql .= ", ";
                }
            }
            $sql .= ");";
            $insertstmt = $conn->prepare($sql);
            for($i=0; $i < count($data_array); $i++){
                for($j = 0; $j < count($col_names); $j++){
                    $colname = $col_names[$j];
                    if( ($colname == "run_id") && isset($clientIds["runID"])){
                        $insertstmt->bindValue(":$colname", $clientIds["runID"] );
                    } else if( ($colname == "clientRunKey") && isset($clientIds["runKey"])){
                        $insertstmt->bindValue(":$colname", $clientIds["runKey"] );
                    }
                    else if( ($colname == "recordIndex") ){
                        $insertstmt->bindValue(":$colname", $key );
                    }
                    else if(!isset($data_array[$i][$colname])){
                        $insertstmt->bindValue(":$colname", null, PDO::PARAM_NULL);
                    } else {
                        $insertstmt->bindValue(":$colname", $data_array[$i][$colname]);
                    }
                }
                if($insertstmt->execute())
                {
                    //logIndexSaved($key);
                    $result[$key] = 1; //mark as succeded
                }
            }
        }
    }
    catch(PDOException $e)
    {
        $result['message'] .= " ". $e->getMessage() . json_encode($clientIds);
    }
    $conn = null;
    return $result;
}

function echoAsJsArray($array)
{
    if( isset($array) && is_array($array) && (count($array) > 0) )
    {
        echo '{';
        foreach($array as $key => $value)
        {
                echo "'$key':'$value',";
        }
        echo '}';
    }
    else
    {
        echo 'null'; //no data in $array
    }
}
/*
function clearRunSession()
{
    //clear session variables
    unset($_SESSION['runID']);
    unset($_SESSION['taskID']);
    unset($_SESSION['taskSessionID']);
    unset($_SESSION["taskUrl"]);
    unset($_SESSION["indexesSaved"]);
}
*/
// bruteforce IP ban : log
function logFailedAttemptIP()
{
    try {

        // connect to database
        $conn = sessionOpenDataBase();

        // insert a IP in failedAttemptIP table
        $sql = "INSERT INTO failedAttemptIP (ip, timestamp) VALUES (INET6_ATON('" . getRemoteIP() . "'), ".phpNow().")";

        $addIPStmt = $conn->prepare($sql);

        $addIPStmt->execute();
        
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return false;
    }
}

// bruteforce IP ban : check
// return true if at least $minCount failed attempt in $period minutes
function checkFailedAttemptIP($minCount, $period)
{
    try {

        // connect to database
        $conn = sessionOpenDataBase();

        // get number of failedAttempt for this remote IP in $period minutes
        $sql = "SELECT COUNT(failedAttemptIPKey) FROM failedAttemptIP WHERE IP = INET6_ATON('" . getRemoteIP() . "') AND timestamp > ".phpNow()." - INTERVAL " . $period . " MINUTE";

        $countFailedAttemptStmt = $conn->prepare($sql);

        $countFailedAttemptStmt->execute();

        $failedAttempts = $countFailedAttemptStmt->fetchColumn();
        
        if($failedAttempts >= $minCount)
            return true;
        else
            return false;

    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return true; //safer than return null (null == false is true)
    }
}

// bruteforce IP ban : clean
function cleanOldFailedAttemptIP($period)
{
    try {

        // connect to database
        $conn = sessionOpenDataBase();

        // clean failedAttempt older than $period minutes
        $sql = "DELETE FROM failedAttemptIP WHERE timestamp < ".phpNow()." - INTERVAL " . $period . " MINUTE";

        $cleanFailedAttemptStmt = $conn->prepare($sql);

        $cleanFailedAttemptStmt->execute();
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }
}

/* if behind a nginx reverse proxy configured with :
 *   proxy_set_header X-Real-IP $remote_addr;
 *   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 * return the HTTP_X_REAL_IP value
 * else return the classic REMOTE_ADDR value
*/
function getRemoteIP()
{
    if (isset($_SERVER['HTTP_X_REAL_IP']))
        return $_SERVER['HTTP_X_REAL_IP'];
    else
        return $_SERVER['REMOTE_ADDR'];
}

/* if behind a nginx reverse proxy configured with :
 *   proxy_set_header X-Forwarded-Host $host;
 * return the HTTP_X_FORWARDED_HOST value
 * else return the classic HTTP_HOST value
*/
function getServerHost()
{
    if (isset($_SERVER['HTTP_X_FORWARDED_HOST']))
        return $_SERVER['HTTP_X_FORWARDED_HOST'];
    else
        return $_SERVER['HTTP_HOST'];
}

function sessionOpenDataBase()
{
    // this path should point to your configuration file.
    include('database_config_session.php');
    //connect and set charset to utf8
    $_conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
    $_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $_conn;
}

/* return an SQL compatible string of current date/time */
/* replace the NOW() function  of SQL resquest to use the php server time instead of SQL server time */
function phpNow()
{
    return date("'Y-m-d H:i:s'");
}
?>