-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2025 at 08:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sakan`
--

-- --------------------------------------------------------

--
-- Table structure for table `poster_room`
--

CREATE TABLE `poster_room` (
  `room_id` int(20) UNSIGNED NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `city` text NOT NULL,
  `street` text NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `availability` enum('Availabe','Unavailable') NOT NULL,
  `return_phone` varchar(20) NOT NULL,
  `serial_id` varchar(50) NOT NULL,
  `renter_id` int(10) UNSIGNED NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `gender` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renter`
--

CREATE TABLE `renter` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `phone_num` int(10) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `renter`
--

INSERT INTO `renter` (`id`, `name`, `phone_num`, `email`, `password`, `gender`) VALUES
(1, 'reeem1', 569838329, 'reem1@gmail.com', '$2y$10$d4fd759W1A0RP6oVYT6xde8OFghz0t.aGJECuE6UQ8pc3ZrpjEK2m', 'female');

-- --------------------------------------------------------

--
-- Table structure for table `save`
--

CREATE TABLE `save` (
  `room_id` int(20) UNSIGNED NOT NULL,
  `student_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(10) NOT NULL,
  `phone_num` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` text NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `phone_num`, `email`, `password`, `gender`, `name`) VALUES
(0, '0569838329', 'reem@gmail.com', '$2y$10$3s/M0CfR.eIX8W.V3eSJMeYJiGPmtLdgNqZ092l1iKEYltQbDq29i', 'female', 'reeem');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `poster_room`
--
ALTER TABLE `poster_room`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `serial_id` (`serial_id`),
  ADD KEY `renter_id` (`renter_id`);

--
-- Indexes for table `renter`
--
ALTER TABLE `renter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `save`
--
ALTER TABLE `save`
  ADD KEY `room_id` (`room_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `poster_room`
--
ALTER TABLE `poster_room`
  MODIFY `room_id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `renter`
--
ALTER TABLE `renter`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `poster_room`
--
ALTER TABLE `poster_room`
  ADD CONSTRAINT `poster_room_ibfk_1` FOREIGN KEY (`renter_id`) REFERENCES `renter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `save`
--
ALTER TABLE `save`
  ADD CONSTRAINT `save_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `poster_room` (`room_id`),
  ADD CONSTRAINT `save_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
