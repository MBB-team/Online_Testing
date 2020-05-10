SET NAMES utf8;

INSERT INTO `participant` (`participantID`) VALUES ('user1');
INSERT INTO `participant` (`participantID`) VALUES ('user2');
INSERT INTO `participant` (`participantID`) VALUES ('user3');
INSERT INTO `participant` (`participantID`) VALUES ('user4');
INSERT INTO `participant` (`participantID`) VALUES ('user5');
INSERT INTO `participant` (`participantID`) VALUES ('user6');
INSERT INTO `participant` (`participantID`) VALUES ('user7');
INSERT INTO `participant` (`participantID`) VALUES ('user8');
INSERT INTO `participant` (`participantID`) VALUES ('user9');

INSERT INTO `task` (`taskID`, `taskName`, `url`) VALUES ('dummyTask1', 'tache d\'essai 1', 'dummyTask1/index.php');
INSERT INTO `task` (`taskID`, `taskName`, `url`) VALUES ('dummyTask2', 'tache d\'essai 2', 'dummyTask2/index.php');

INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'dummyTask1_S1', '2020-05-07 00:00:00', '2020-05-08 00:00:00', 'dummyTask1');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'dummyTask2_S1', '2020-05-07 00:00:00', '2020-05-08 00:00:00', 'dummyTask2');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'dummyTask1_S2', '2020-05-08 00:00:00', '2020-05-09 00:00:00', 'dummyTask1');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'dummyTask2_S2', '2020-05-08 00:00:00', '2020-05-09 00:00:00', 'dummyTask2');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'dummyTask1_S3', '2020-05-09 00:00:00', '2020-05-10 00:00:00', 'dummyTask1');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'dummyTask2_S3', '2020-05-09 00:00:00', '2020-05-10 00:00:00', 'dummyTask2');
