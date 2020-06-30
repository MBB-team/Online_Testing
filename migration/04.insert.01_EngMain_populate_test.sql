SET NAMES utf8;

INSERT INTO `task` (`taskID`, `taskName`, `url`, `dataTableName`) VALUES ('ENGMAIN', 'Tâche d''engagement', 'EngMain/index.php', 'tableEngMain');

INSERT INTO `taskSession` (`taskSessionID`, `sessionName`, `openingTime`, `closingTime`, `task_taskID`) VALUES (NULL, 'ENGMAIN_S1', '2020-06-29 00:00:00', '2020-07-02 00:00:00', 'ENGMAIN');
