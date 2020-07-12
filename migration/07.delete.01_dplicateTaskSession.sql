/* Delete dummy tasks infos and their datas */

SET NAMES utf8;


/* delete sessions info from taskSession table */
DELETE FROM taskSession WHERE taskSessionID>='30' AND taskSessionID<='84';
DELETE FROM taskSession WHERE taskSessionID>='99' AND taskSessionID<='107';
