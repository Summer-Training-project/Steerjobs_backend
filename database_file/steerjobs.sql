
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `applyjobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
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


CREATE TABLE `postjobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(500) NOT NULL,
  `userId` varchar(500) DEFAULT NULL,
  `skills` varchar(500) NOT NULL,
  `jobTitle` varchar(500) DEFAULT NULL,
  `companyName` varchar(500) DEFAULT NULL,
  `city` varchar(500) DEFAULT NULL,
  `country` varchar(500) DEFAULT NULL,
  `numbApplicants` int(11) DEFAULT NULL,
  `workingType` varchar(500) DEFAULT NULL,
  `jobDesc` varchar(10000) DEFAULT NULL,
  `postDateTime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `userinfo` (
  `token` varchar(1000) DEFAULT NULL,
  `Id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(500) DEFAULT NULL,
  `userId` varchar(500) DEFAULT NULL,
  `gender` varchar(500) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `country` varchar(500) DEFAULT NULL,
  `countryCode` varchar(500) DEFAULT NULL,
  `mobile` bigint(11) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `briefIntro` varchar(1000) DEFAULT NULL,
  `education` varchar(500) DEFAULT NULL,
  `institution` varchar(500) DEFAULT NULL,
  `skills` varchar(500) DEFAULT NULL,
  `databaseLink` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

