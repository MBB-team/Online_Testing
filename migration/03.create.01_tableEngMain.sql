SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `databaseEmo`
--

-- --------------------------------------------------------

--
-- Table structure for table `tableEngMain`
--

CREATE TABLE `tableEngMain` (
  `rt` float DEFAULT NULL,
  `correct` int(3) DEFAULT NULL,
  `stimulus` text DEFAULT NULL,
  `key_press` int(3) DEFAULT NULL,
  `responses` text DEFAULT NULL,
  `button_pressed` int(3) DEFAULT NULL,
  `trialNb` int(3) DEFAULT NULL,
  `target_trial` int(3) DEFAULT NULL,
  `switch_trial` int(3) DEFAULT NULL,
  `trial_result` int(3) DEFAULT NULL,
  `test_part` text DEFAULT NULL,
  `reward` int(3) DEFAULT NULL,
  `effort` int(3) DEFAULT NULL,
  `phase` int(3) DEFAULT NULL,
  `training` int(3) DEFAULT NULL,
  `stim_counter` int(3) DEFAULT NULL,
  `target_counter` int(3) DEFAULT NULL,
  `diff_step` int(3) DEFAULT NULL,
  `trial_type` text DEFAULT NULL,
  `trial_index` int(25) DEFAULT NULL,
  `time_elapsed` int(25) DEFAULT NULL,
  `internal_node_id` text DEFAULT NULL,
  `date` text DEFAULT NULL,
  `run_id` int(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
