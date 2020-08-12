-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2020 at 09:10 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2
-- Modified by Gilles Rautureau on August 10 2020
--    Remove table character set to use the database default charset
--    Remove time_zone

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
--SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `databaseEmo`
--

-- --------------------------------------------------------

--
-- Table structure for table `tableConstance`
--

CREATE TABLE `tableConstance` (
  `rt` float DEFAULT NULL,
  `stimulus` text DEFAULT NULL,
  `button_pressed` int(3) DEFAULT NULL,
  `responses` text DEFAULT NULL,
  `key_press` int(3) DEFAULT NULL,
  `test_part` text DEFAULT NULL,
  `trialNb` int(3) DEFAULT NULL,
  `effort` text DEFAULT NULL,
  `condiEffort` int(3) DEFAULT NULL,
  `rwd` text DEFAULT NULL,
  `condiRwd` int(3) DEFAULT NULL,
  `trial_type` text DEFAULT NULL,
  `trial_index` int(25) DEFAULT NULL,
  `time_elapsed` int(25) DEFAULT NULL,
  `internal_node_id` text DEFAULT NULL,
  `run_id` int(7) NOT NULL,
  `date` text DEFAULT NULL
) ENGINE=InnoDB;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;