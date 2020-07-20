-- Add active field

SET NAMES utf8;

ALTER TABLE participant ADD COLUMN active BOOLEAN DEFAULT TRUE;
