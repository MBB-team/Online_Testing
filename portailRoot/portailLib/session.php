<?php

session_name('onlinetesting');

session_start();



function identify($participantID)
{
    
    try {
        
        // this path should point to your configuration file.
        include('database_config_session.php');
        // connect to database
        $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT COUNT(participantID) FROM participant WHERE participantID = '".$participantID."'";
        $userInDatabaseStmt = $conn->prepare($sql);

        $userInDatabaseStmt->execute();
        $userCount = $userInDatabaseStmt->fetchColumn();
        if($userCount>0) //found valid user ID
        {
            $_SESSION['participantID'] = $participantID; //save in session
        }
        else //not found
        {
            unset($_SESSION['participantID']); //clear in session
        }
    }
    catch(PDOException $e)
    {
        print "Erreur !:" . $e->getMessage() . "<br/>";
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

        // this path should point to your configuration file.
        include('database_config_session.php');
        // connect to database
        $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Get all opened tasks
        $sql = "SELECT * FROM task, taskSession WHERE taskID = task_taskID AND openingTime < NOW() AND closingTime > NOW()";
        //if $taskID is supplied. Filter only this task
        if($task!="")
        {
            $sql.=" AND taskID = '". $taskID ."'";
        }
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
                $openedTask[$key]["done"] = false;
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

function startTask($taskID) //if everything allright, add a line to run table, set Session variable and return true. //otherwise return false
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

        // this path should point to your configuration file.
        include('database_config_session.php');
        // connect to database
        $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // insert a new run
        $sql = "INSERT INTO run ('startTime', 'participant_participantID', 'taskSession_taskSessionID') ";
        $sql.= "VALUES (NOW(),'".$_SESSION["participantID"]."',".$availableTasks[0]["taskSessionID"].")";

        $addRunStmt = $conn->prepare($sql);

        $addRunStmt->execute();
        
        //Get runID
        $sql = "SELECT LAST_INSERT_ID()";
        $runIDStmt = $conn->prepare($sql);
        $runIDStmt->execute();

        $_SESSION["runID"] = $runIDStmt->fetchColumn();
        $_SESSION["taskID"] = $taskID;
        $_SESSION["taskSessionID"] = $availableTasks[0]["taskSessionID"];

    }
    catch(PDOException $e)
    {
        
        print "Erreur !:" . $e->getMessage() . "<br/>";
    }

}

function endTask()
{
    //update current run with doneTime


    //clear session variables
    unset($_SESSION['runID']);
    unset($_SESSION['taskID']);
    unset($_SESSION['taskSessionID']);
    
}
?>