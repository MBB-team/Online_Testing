-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2020 at 10:18 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `databaseemo`
--

-- --------------------------------------------------------

--
-- Table structure for table `tableemo`
--

CREATE TABLE `tableEmo` (
  `rt` double DEFAULT NULL,
  `stimulus` text DEFAULT NULL,
  `responses` text DEFAULT NULL,
  `key_press` int(3) DEFAULT NULL,
  `test_part` text DEFAULT NULL,
  `blockNb` int(3) DEFAULT NULL,
  `trialNb` int(3) DEFAULT NULL,
  `condiEmoBlock` int(3) DEFAULT NULL,
  `condiEmoTrial` int(3) DEFAULT NULL,
  `condiRwd` int(3) DEFAULT NULL,
  `posCritDist` int(3) DEFAULT NULL,
  `distractor` int(3) DEFAULT NULL,
  `posTarget` int(3) DEFAULT NULL,
  `target` int(3) DEFAULT NULL,
  `trial_type` text DEFAULT NULL,
  `trial_index` int(25) DEFAULT NULL,
  `time_elapsed` int(25) DEFAULT NULL,
  `internal_node_id` text DEFAULT NULL,
  `subject_id` int(7) NOT NULL,
  `date` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
