-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2020 at 07:13 PM
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
-- Table structure for table `tableQuest`
--

CREATE TABLE `tableQuest` (
  `rt` float DEFAULT NULL,
  `stimulus` varchar(250) DEFAULT NULL,
  `key_press` int(3) DEFAULT NULL,
  `responses` varchar(250) DEFAULT NULL,
  `test_part` varchar(25) DEFAULT NULL,
  `trial_type` varchar(25) DEFAULT NULL,
  `trial_index` int(25) DEFAULT NULL,
  `time_elapsed` int(25) DEFAULT NULL,
  `internal_node_id` varchar(25) DEFAULT NULL,
  `subject_id` int(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
