-- --------------------------------------------------------
-- 호스트:                          classum-rds-dev-ap-northeast-2.cledddgfrnxl.ap-northeast-2.rds.amazonaws.com
-- 서버 버전:                        8.0.35 - Source distribution
-- 서버 OS:                        Linux
-- HeidiSQL 버전:                  12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 classum_dev.post 구조 내보내기
CREATE TABLE IF NOT EXISTS `post` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `space_id` int NOT NULL,
  `post_name` varchar(128) NOT NULL,
  `post_contents` varchar(1024) NOT NULL,
  `post_category` varchar(30) NOT NULL,
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `updated_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_anonymous` tinyint NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `space_id` (`space_id`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `post_ibfk_2` FOREIGN KEY (`space_id`) REFERENCES `space` (`space_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.post_comment 구조 내보내기
CREATE TABLE IF NOT EXISTS `post_comment` (
  `post_comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `post_comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `updated_at` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_anonymous` tinyint NOT NULL,
  PRIMARY KEY (`post_comment_id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `post_comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `post_comment_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.post_comment_reply 구조 내보내기
CREATE TABLE IF NOT EXISTS `post_comment_reply` (
  `post_comment_reply_id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `post_comment_reply` varchar(255) NOT NULL,
  `updated_at` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_anonymous` tinyint NOT NULL,
  PRIMARY KEY (`post_comment_reply_id`),
  KEY `fk_user_id_reply` (`user_id`),
  KEY `fk_comment_id_reply` (`comment_id`),
  CONSTRAINT `fk_comment_id_reply` FOREIGN KEY (`comment_id`) REFERENCES `post_comment` (`post_comment_id`),
  CONSTRAINT `fk_user_id_reply` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.post_file 구조 내보내기
CREATE TABLE IF NOT EXISTS `post_file` (
  `post_file_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `post_file_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`post_file_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `post_file_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.space 구조 내보내기
CREATE TABLE IF NOT EXISTS `space` (
  `space_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `space_name` varchar(50) NOT NULL,
  `space_logo` varchar(128) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`space_id`),
  KEY `FK_user_id` (`user_id`),
  CONSTRAINT `FK_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.space_role 구조 내보내기
CREATE TABLE IF NOT EXISTS `space_role` (
  `space_role_id` int NOT NULL AUTO_INCREMENT,
  `space_id` int NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `role_level` varchar(30) NOT NULL,
  `space_update` tinyint NOT NULL,
  `space_delete` tinyint NOT NULL,
  `space_forced_exit` tinyint NOT NULL,
  `space_owner_assign` tinyint NOT NULL,
  `space_role_update` tinyint NOT NULL,
  `space_role_delete` tinyint NOT NULL,
  `space_post_notice` tinyint NOT NULL,
  `space_post_admin_delete` tinyint NOT NULL,
  `space_chat_admin_delete` tinyint NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  PRIMARY KEY (`space_role_id`),
  KEY `space_id` (`space_id`),
  CONSTRAINT `space_role_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `space` (`space_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.space_role_code 구조 내보내기
CREATE TABLE IF NOT EXISTS `space_role_code` (
  `space_role_code_id` int NOT NULL AUTO_INCREMENT,
  `space_role_id` int DEFAULT NULL,
  `space_id` int NOT NULL,
  `space_role_code` varchar(20) NOT NULL,
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`space_role_code_id`),
  KEY `space_role_id` (`space_role_id`),
  KEY `space_role_code` (`space_role_code`),
  KEY `fk_space_role_code_space` (`space_id`),
  CONSTRAINT `fk_space_role_code_space` FOREIGN KEY (`space_id`) REFERENCES `space` (`space_id`) ON DELETE CASCADE,
  CONSTRAINT `space_role_code_ibfk_1` FOREIGN KEY (`space_role_id`) REFERENCES `space_role` (`space_role_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.space_user_alarm 구조 내보내기
CREATE TABLE IF NOT EXISTS `space_user_alarm` (
  `space_user_alarm_id` int NOT NULL AUTO_INCREMENT,
  `space_id` int NOT NULL,
  `user_id` int NOT NULL,
  `post_id` int DEFAULT NULL,
  `post_create` tinyint NOT NULL DEFAULT '0',
  `post_update` tinyint NOT NULL DEFAULT '0',
  `comment_create` tinyint NOT NULL DEFAULT '0',
  `created_at` varchar(255) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`space_user_alarm_id`),
  KEY `FK_space_user_alarm_space` (`space_id`),
  KEY `FK_space_user_alarm_user` (`user_id`),
  KEY `FK_space_user_alarm_post` (`post_id`),
  CONSTRAINT `FK_space_user_alarm_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_space_user_alarm_space` FOREIGN KEY (`space_id`) REFERENCES `space` (`space_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_space_user_alarm_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.space_user_alarm_settings 구조 내보내기
CREATE TABLE IF NOT EXISTS `space_user_alarm_settings` (
  `space_user_alarm_settings_id` int NOT NULL AUTO_INCREMENT,
  `space_id` int NOT NULL,
  `user_id` int NOT NULL,
  `post_create` tinyint NOT NULL DEFAULT '1',
  `post_update` tinyint NOT NULL DEFAULT '1',
  `comment_create` tinyint NOT NULL DEFAULT '1',
  `created_at` varchar(255) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`space_user_alarm_settings_id`) USING BTREE,
  KEY `FK_space_user_alarm_settings_space` (`space_id`),
  KEY `FK_space_user_alarm_settings_user` (`user_id`),
  CONSTRAINT `FK_space_user_alarm_settings_space` FOREIGN KEY (`space_id`) REFERENCES `space` (`space_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_space_user_alarm_settings_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.space_user_role 구조 내보내기
CREATE TABLE IF NOT EXISTS `space_user_role` (
  `space_user_role_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `space_id` int NOT NULL,
  `space_role_id` int NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  PRIMARY KEY (`space_user_role_id`),
  KEY `user_id` (`user_id`),
  KEY `space_id` (`space_id`),
  KEY `space_role_id` (`space_role_id`),
  CONSTRAINT `space_user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `space_user_role_ibfk_2` FOREIGN KEY (`space_id`) REFERENCES `space` (`space_id`),
  CONSTRAINT `space_user_role_ibfk_3` FOREIGN KEY (`space_role_id`) REFERENCES `space_role` (`space_role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 classum_dev.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `profile_image` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
