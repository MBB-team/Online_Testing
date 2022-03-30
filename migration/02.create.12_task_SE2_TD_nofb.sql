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
-- Table structure for table `tableSE2_TD_nofb`
--

CREATE TABLE IF NOT EXISTS `tableSE2_TD_nofb` (
  `rt` text DEFAULT NULL,
  `stimulus` text DEFAULT NULL,
  `button_pressed` int(3) DEFAULT NULL,
  `flips` int(3) DEFAULT NULL,
  `conf_response` int(3) DEFAULT NULL,
  `responses` text DEFAULT NULL,
  `SE_max` int(3) DEFAULT NULL,
  `SE_min` int(3) DEFAULT NULL,
  `SE_max_ini` int(3) DEFAULT NULL,
  `SE_min_ini` int(3) DEFAULT NULL,
  `response_row` text DEFAULT NULL,
  `response_col` text DEFAULT NULL,
  `target_row` int(3) DEFAULT NULL,
  `target_col` int(3) DEFAULT NULL,
  `correct_row` int(3) DEFAULT NULL,
  `correct_col` int(3) DEFAULT NULL,
  `correct` tinyint(1) DEFAULT NULL,
  `blockNb` int(3) DEFAULT NULL,
  `trialNb` int(3) DEFAULT NULL,
  `TinB` int(3) DEFAULT NULL,
  `testNb` int(3) DEFAULT NULL,
  `target_score` int(3) DEFAULT NULL,
  `test_part` text DEFAULT NULL,
  `trial_type` text DEFAULT NULL,
  `trial_index` int(25) DEFAULT NULL,
  `nTS` text DEFAULT NULL,
  `reward` int(3) DEFAULT NULL,
  `trial_time_elapsed` int(50) DEFAULT NULL,
  `time_elapsed` int(50) DEFAULT NULL,
  `internal_node_id` text DEFAULT NULL,
  `run_id` int(7) NOT NULL,
  `date` text DEFAULT NULL,
  `clientRunKey` VARCHAR(8) NULL,
  `recordIndex` INT NULL
) ENGINE=InnoDB;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
