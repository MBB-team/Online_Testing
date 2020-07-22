-- remove correct_Dummy4 and correct_ecosystem column

SET NAMES utf8;

ALTER TABLE table_DPD DROP COLUMN correct_Dummy4,
                        DROP COLUMN correct_ecosystem;
