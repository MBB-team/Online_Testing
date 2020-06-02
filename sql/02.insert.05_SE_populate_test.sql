SET NAMES utf8;

INSERT INTO `task` (`taskID`, `taskName`, `url`) VALUES ('SE', 'Self_Efficacy', 'Self_Efficacy/index.php');

INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'SE_S1', '2020-05-12 00:00:00', '2020-05-13 00:00:00', 'SE');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'SE_S2', '2020-05-13 00:00:00', '2020-05-14 00:00:00', 'SE');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'SE_S3', '2020-05-14 00:00:00', '2020-05-15 00:00:00', 'SE');
