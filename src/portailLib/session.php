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
                unset($_SESSION['participantID']); //clear in session
                return "inactiveUser";
            }
        }
        else if(count($userInDatabaseFetch)==0)//not found
        {
            unset($_SESSION['participantID']); //clear in session
            logFailedAttemptIP(); //log failed attempt remote IP
            return "unknownUser";
        }
        else //unknown error
        {
            unset($_SESSION['participantID']); //clear in session
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

function prepareTask($taskID) //if everything allright, add a line to run table, set Session variable and return true. //otherwise return false
{
    //check if user can do the task
    $availableTasks = getAvailableTask($taskID);
    if(count($availableTasks)!=1) //assuming max one session can opened for one task at a time
    {
        //invalid task
        return(false);
    }
    if($availableTasks[0]["done"])
    {
        //task already done
        return(false);
    }

    try {

        // connect to database
        $conn = sessionOpenDataBase();

        // insert a new run
        $sql = "INSERT INTO run (startTime, participant_participantID, taskSession_taskSessionID) ";
        $sql.= "VALUES (".phpNow().",'".$_SESSION["participantID"]."',".$availableTasks[0]["taskSessionID"].")";

        $addRunStmt = $conn->prepare($sql);

        $addRunStmt->execute();
        
        //Get runID
        $sql = "SELECT LAST_INSERT_ID()";
        $runIDStmt = $conn->prepare($sql);
        if($runIDStmt->execute())
        {
                $_SESSION["runID"] = $runIDStmt->fetchColumn();
                $_SESSION["taskID"] = $taskID;
                $_SESSION["taskSessionID"] = $availableTasks[0]["taskSessionID"];
                $_SESSION["taskUrl"] = $availableTasks[0]["url"];

                return true;
        }
        else
        {
            clearRunSession();
            return false;
        }

    }
    catch(PDOException $e)
    {
        
        print "Erreur !:" . $e->getMessage() . "<br/>";
        clearRunSession();
        return false;
    }

}

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

//update a run with doneTime to phpNow(), return true on success
function endTask()
{
    if(!isPreparedTask())
    {
        //no run started in this session environement
        return false;
    }
    //update current run with doneTime
    try {

        // connect to database
        $conn = sessionOpenDataBase();

        // update run with doneTime
        $sql = "UPDATE run SET doneTime=".phpNow()." WHERE runID='".getRunID()."'";

        $addRunStmt = $conn->prepare($sql);

        $addRunSucces = $addRunStmt->execute();

        if($addRunSucces)
        {
            clearRunSession();
        }
        return $addRunSucces;
    }
    catch(PDOException $e)
    {
        
        print "Erreur !:" . $e->getMessage() . "<br/>";
        return false;
    }

    
}

function clearRunSession()
{
    //clear session variables
    unset($_SESSION['runID']);
    unset($_SESSION['taskID']);
    unset($_SESSION['taskSessionID']);
    unset($_SESSION["taskUrl"]);
}

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