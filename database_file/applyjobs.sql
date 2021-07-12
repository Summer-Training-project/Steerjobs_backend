-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2021 at 05:55 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `steerjobs`
--

-- --------------------------------------------------------

--
-- Table structure for table `applyjobs`
--

CREATE TABLE `applyjobs` (
  `id` int(11) NOT NULL,
  `postId` int(11) DEFAULT NULL,
  `applyName` varchar(500) NOT NULL,
  `applySkills` varchar(500) NOT NULL,
  `applyAddress` varchar(500) NOT NULL,
  `applyCountry` varchar(500) NOT NULL,
  `postUserId` varchar(500) DEFAULT NULL,
  `applyUserId` varchar(500) DEFAULT NULL,
  `applyEmail` varchar(500) DEFAULT NULL,
  `applyCountryCode` varchar(500) NOT NULL,
  `applyMobile` bigint(20) DEFAULT NULL,
  `rusumePath` varchar(500) DEFAULT NULL,
  `applyDateTime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applyjobs`
--
ALTER TABLE `applyjobs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applyjobs`
--
ALTER TABLE `applyjobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
