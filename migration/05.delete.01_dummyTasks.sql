/* Delete dummy tasks infos and their datas */

SET NAMES utf8;


/* don't auto commit so all command are done in one shot */
BEGIN;

/* remove datas from run table */
DELETE FROM run WHERE taskSession_taskSessionID IN (SELECT taskSessionID FROM taskSession WHERE task_taskID='dummyTask1' OR task_taskID='dummyTask2');

/* delete sessions info from taskSession table */
DELETE FROM taskSession WHERE task_taskID='dummyTask1' OR task_taskID='dummyTask2';

/* delete tasks info from task table */
DELETE FROM task WHERE taskID='dummyTask1' OR taskID='dummyTask2';

COMMIT;
