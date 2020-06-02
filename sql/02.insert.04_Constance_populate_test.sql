SET NAMES utf8;

INSERT INTO `task` (`taskID`, `taskName`, `url`) VALUES ('CONST', 'Constances', 'Constance_Project/index.php');

INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'CONST_S1', '2020-05-12 00:00:00', '2020-05-13 00:00:00', 'CONST');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'CONST_S2', '2020-05-13 00:00:00', '2020-05-14 00:00:00', 'CONST');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'CONST_S3', '2020-05-14 00:00:00', '2020-05-15 00:00:00', 'CONST');
