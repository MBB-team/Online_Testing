SET NAMES utf8;

ALTER TABLE task ADD COLUMN dataTableName VARCHAR(25) NULL;
UPDATE task SET dataTableName='table_DPD' WHERE taskID='DPD';
UPDATE task SET dataTableName='tableConstance' WHERE taskID='CONST';
UPDATE task SET dataTableName='tableEmo' WHERE taskID='EMOREG';
UPDATE task SET dataTableName='tableQuest' WHERE taskID='QUEST';
UPDATE task SET dataTableName='tableSE' WHERE taskID='SE';
