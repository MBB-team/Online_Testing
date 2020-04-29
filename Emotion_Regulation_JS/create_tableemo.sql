-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2020 at 02:52 PM
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

CREATE TABLE `tableemo` (
  `rt` double DEFAULT NULL,
  `stimulus` varchar(25) DEFAULT NULL,
  `responses` varchar(25) DEFAULT NULL,
  `key_press` int(3) DEFAULT NULL,
  `test_part` varchar(25) DEFAULT NULL,
  `blockNb` int(3) DEFAULT NULL,
  `trialNb` int(3) DEFAULT NULL,
  `condiEmoBlock` int(3) DEFAULT NULL,
  `condiEmoTrial` int(3) DEFAULT NULL,
  `condiRwd` int(3) DEFAULT NULL,
  `posCritDist` int(3) DEFAULT NULL,
  `distractor` int(3) DEFAULT NULL,
  `posTarget` int(3) DEFAULT NULL,
  `target` int(3) DEFAULT NULL,
  `trial_type` varchar(25) DEFAULT NULL,
  `trial_index` int(25) DEFAULT NULL,
  `time_elapsed` int(25) DEFAULT NULL,
  `internal_node_id` varchar(25) DEFAULT NULL,
  `subject_id` int(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
