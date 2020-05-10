SET NAMES utf8;

INSERT INTO `task` (`taskID`, `taskName`, `url`) VALUES ('EMOREG', 'Tâche Emotion Regulation', 'Emotion_Regulation_JS/index.php');

INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'EMOREG_S1', '2020-05-09 00:00:00', '2021-05-10 00:00:00', 'EMOREG');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'EMOREG_S2', '2020-05-10 00:00:00', '2021-05-11 00:00:00', 'EMOREG');
INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'EMOREG_S3', '2020-05-11 00:00:00', '2021-05-12 00:00:00', 'EMOREG');
