-- MySQL Script generated by MySQL Workbench
-- Thu May  7 14:01:34 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering
-- Modified by Gilles Rautureau on August 10 2020
--    (Merge alter)

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema databaseEmo
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema databaseEmo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `databaseEmo` DEFAULT CHARACTER SET utf8 ;
USE `databaseEmo` ;

-- -----------------------------------------------------
-- Table `databaseEmo`.`participant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databaseEmo`.`participant` (
  `participantID` VARCHAR(25) NOT NULL,
  `active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`participantID`))
ENGINE = InnoDB
COMMENT = 'All valid participant ID';


-- -----------------------------------------------------
-- Table `databaseEmo`.`task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databaseEmo`.`task` (
  `taskID` VARCHAR(25) NOT NULL,
  `taskName` TEXT NOT NULL,
  `url` TEXT NOT NULL,
  `dataTableName` VARCHAR(25) NULL,
  PRIMARY KEY (`taskID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `databaseEmo`.`taskSession`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databaseEmo`.`taskSession` (
  `taskSessionID` INT NOT NULL AUTO_INCREMENT,
  `sessionName` TEXT NOT NULL,
  `openingTime` DATETIME NOT NULL,
  `closingTime` DATETIME NOT NULL,
  `task_taskID` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`taskSessionID`),
  INDEX `fk_taskSession_task_idx` (`task_taskID` ASC),
  CONSTRAINT `fk_taskSession_task`
    FOREIGN KEY (`task_taskID`)
    REFERENCES `databaseEmo`.`task` (`taskID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `databaseEmo`.`run`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databaseEmo`.`run` (
  `runID` INT NOT NULL AUTO_INCREMENT,
  `startTime` DATETIME NOT NULL,
  `doneTime` DATETIME NULL,
  `participant_participantID` VARCHAR(25) NOT NULL,
  `taskSession_taskSessionID` INT NOT NULL,
  `runKey` VARCHAR(8) NULL UNIQUE,
  PRIMARY KEY (`runID`),
  INDEX `fk_run_participant1_idx` (`participant_participantID` ASC),
  INDEX `fk_run_taskSession1_idx` (`taskSession_taskSessionID` ASC),
  CONSTRAINT `fk_run_participant1`
    FOREIGN KEY (`participant_participantID`)
    REFERENCES `databaseEmo`.`participant` (`participantID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_run_taskSession1`
    FOREIGN KEY (`taskSession_taskSessionID`)
    REFERENCES `databaseEmo`.`taskSession` (`taskSessionID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `databaseEmo`.`failedAttemptIP`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databaseEmo`.`failedAttemptIP` (
  `failedAttemptIPKey` int(11) NOT NULL AUTO_INCREMENT,
  `ip` VARBINARY(16) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`failedAttemptIPKey`))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
