/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 80029
Source Host           : localhost:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 80029
File Encoding         : 65001

Date: 2022-11-12 21:07:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for captcha
-- ----------------------------
DROP TABLE IF EXISTS `captcha`;
CREATE TABLE `captcha` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` varchar(8) DEFAULT 'true',
  `account` varchar(255) DEFAULT NULL,
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verify_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of captcha
-- ----------------------------
INSERT INTO `captcha` VALUES ('1', 'AR6K', 'false', 'Moshiqu', '2022-11-11 23:35:36', null);
INSERT INTO `captcha` VALUES ('2', 'nrbI', 'false', 'Moshiqu', '2022-11-12 13:14:48', null);
INSERT INTO `captcha` VALUES ('3', 'H0tI', 'false', 'Moshiqu', '2022-11-12 13:15:49', null);
INSERT INTO `captcha` VALUES ('4', 'r9cS', 'false', 'Moshiqu', '2022-11-12 13:25:14', null);
INSERT INTO `captcha` VALUES ('5', 'RHVw', 'true', 'Moshiqu', '2022-11-12 13:40:22', null);
INSERT INTO `captcha` VALUES ('6', '2OvF', 'false', 'Moshiqu3332', '2022-11-12 13:40:43', null);
INSERT INTO `captcha` VALUES ('7', 'XGGQ', 'false', 'Moshiqu33321', '2022-11-12 18:50:19', null);
INSERT INTO `captcha` VALUES ('8', 'lMQo', 'true', 'Moshiqu33321', '2022-11-12 18:59:31', null);
INSERT INTO `captcha` VALUES ('9', 'nnFQ', 'false', 'Moshiqu1', '2022-11-12 18:59:38', null);
INSERT INTO `captcha` VALUES ('10', 'FO0v', 'false', 'Moshiqu2', '2022-11-12 19:05:56', null);
INSERT INTO `captcha` VALUES ('11', 'Iouy', 'true', 'Moshiqu2', '2022-11-12 20:24:10', null);
INSERT INTO `captcha` VALUES ('12', 'dxhr', 'true', 'Moshiqu2', '2022-11-12 20:42:33', null);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `is_active` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT 'true',
  `account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', null, 'true', 'Moshiqu', '123@qq.com', 'moshiqu3332', null);
INSERT INTO `users` VALUES ('11', null, 'true', 'moshiqu111111', '1213111111@qq.com', 'moshiqu', null);
INSERT INTO `users` VALUES ('12', null, 'false', 'moshiqu1111111', '12131111111@qq.com', 'moshiqu', null);
INSERT INTO `users` VALUES ('13', null, 'true', 'moshiqu11111111', '121311111111@qq.com', '$2b$05$fOkHZrT31R6cx9FcSfUl8e4jjrtmzggS6NbpTZhRqqqVMkcZODvKa', null);
INSERT INTO `users` VALUES ('14', '鱼与天与海', 'true', 'Moshiqu3332', '91232350@qq.com', 'Moshiqu1', 'www.asdf.com');
INSERT INTO `users` VALUES ('15', null, 'true', 'Moshiqu33321', '912323501@qq.com', 'Moshiqu12', null);
INSERT INTO `users` VALUES ('16', null, 'true', 'Moshiqu1', '9123223@qq.com', 'Moshiqu2', null);
INSERT INTO `users` VALUES ('17', null, 'true', 'Moshiqu2', '91232223@qq.com', '$2b$10$wmYo5TPkZCmdx83XJJxy0OAp2ewlJ0nURT9q8pIowh/uroDmDjAAK', null);
