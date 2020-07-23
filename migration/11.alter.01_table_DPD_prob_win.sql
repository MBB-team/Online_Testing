-- prob_win decimal(3,3) => prob_win decimal(6,3)

SET NAMES utf8;

ALTER TABLE table_DPD MODIFY prob_win DECIMAL(6,3);
