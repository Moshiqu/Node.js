/*
Navicat MySQL Data Transfer

Source Server         : infoinge
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2022-12-01 18:00:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for postal_options
-- ----------------------------
DROP TABLE IF EXISTS `postal_options`;
CREATE TABLE `postal_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_active` varchar(8) NOT NULL DEFAULT 'true',
  `start_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `sender` varchar(120) NOT NULL,
  `destination_mail` varchar(255) NOT NULL,
  `send_time` datetime NOT NULL,
  `is_open` varchar(8) DEFAULT 'false',
  `content` text NOT NULL,
  `account` varchar(255) DEFAULT NULL,
  `mail_key` varchar(120) NOT NULL DEFAULT 'false' COMMENT '是否寄出',
  `is_send` varchar(8) DEFAULT 'false',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of postal_options
-- ----------------------------
INSERT INTO `postal_options` VALUES ('14', 'true', '2022-11-30 15:10:33', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'false', '<p>123</p>', null, '29b0491c-64f2-4add-a05b-a1b09e04061e', 'false');
INSERT INTO `postal_options` VALUES ('15', 'true', '2022-11-30 15:12:27', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'false', '<p>123</p>', null, 'cee8afc6-544a-4e0f-ba9f-999ebf729666', 'false');
INSERT INTO `postal_options` VALUES ('16', 'true', '2022-11-30 15:16:12', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '64fcfb89-5427-4759-bdff-1e5ebda94599', 'false');
INSERT INTO `postal_options` VALUES ('17', 'true', '2022-11-30 15:17:33', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '520313cb-6015-4e0c-8d88-ecd62b1dbe77', 'false');
INSERT INTO `postal_options` VALUES ('18', 'true', '2022-11-30 15:26:53', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '269f4d4d-f683-46a8-b4d6-040a95ae4e3f', 'false');
INSERT INTO `postal_options` VALUES ('19', 'true', '2022-11-30 15:28:00', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '3f94fc4f-46e4-494f-bfd3-edee52c966bb', 'false');
INSERT INTO `postal_options` VALUES ('20', 'true', '2022-11-30 15:29:24', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, 'e2aa6c6d-4b8a-4b3d-ae65-4298828eaa98', 'false');
INSERT INTO `postal_options` VALUES ('21', 'true', '2022-11-30 15:32:07', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, 'b0788e74-77de-497a-80c0-702b42aed975', 'false');
INSERT INTO `postal_options` VALUES ('22', 'true', '2022-11-30 15:32:23', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '00698c09-c837-409b-a5ef-805d86e2f5f4', 'false');
INSERT INTO `postal_options` VALUES ('23', 'true', '2022-11-30 15:32:41', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '803d4d5f-5a5d-46dc-845e-190e0c62782e', 'false');
INSERT INTO `postal_options` VALUES ('24', 'true', '2022-11-30 15:34:45', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '488cc30e-f938-417b-855a-305cdae8cd29', 'false');
INSERT INTO `postal_options` VALUES ('25', 'true', '2022-11-30 15:36:49', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '5080f078-d38d-4039-abb9-34cc7abecc9d', 'false');
INSERT INTO `postal_options` VALUES ('26', 'true', '2022-11-30 15:38:11', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', null, '68e80953-35ff-4606-9b59-25daac02fb86', 'false');
INSERT INTO `postal_options` VALUES ('27', 'true', '2022-11-30 15:42:17', '1312123', '123@qq.com', '2022-12-01 15:09:13', 'true', '<p>123</p>', 'admin', '5050991b-2118-4991-b9d4-7ed239ecfdef', 'false');
INSERT INTO `postal_options` VALUES ('28', 'true', '2022-11-30 15:52:22', '阿松大', '123@qq.com', '2022-12-01 15:52:10', 'true', '<p>阿松大</p>', 'admin', '349b06d8-2966-45e1-af99-8f71562fda1b', 'false');
INSERT INTO `postal_options` VALUES ('29', 'true', '2022-11-30 16:02:20', '阿松大', '123@qq.com', '2022-12-01 15:52:10', 'true', '<p>阿松大</p>', 'admin', '2ef30cb2-2227-4d89-a019-67c7e94d9d29', 'false');
INSERT INTO `postal_options` VALUES ('30', 'true', '2022-11-30 16:06:42', '阿松大', '123@qq.com', '2022-12-01 15:52:10', 'true', '<p>阿松大</p>', 'admin', 'db927e18-8cb0-4976-8dc5-52d2239d45a5', 'false');
INSERT INTO `postal_options` VALUES ('31', 'true', '2022-11-30 16:11:35', '阿松大', '123@qq.com', '2022-12-01 15:52:10', 'true', '<p>阿松大</p>', 'admin', '94341be4-8e54-4805-b5a1-4a1db9889981', 'false');
INSERT INTO `postal_options` VALUES ('32', 'true', '2022-11-30 16:12:14', '阿松大', '123@qq.com', '2022-12-01 15:52:10', 'true', '<p>阿松大</p>', 'admin', '99838a15-ff46-4a59-b91a-d406787fc382', 'false');
INSERT INTO `postal_options` VALUES ('33', 'true', '2022-11-30 16:12:36', '阿松大', '123@qq.com', '2022-12-01 15:52:10', 'true', '<p>阿松大</p>', 'admin', '516256cb-721e-49b4-b07d-3d6ed1841d76', 'false');
INSERT INTO `postal_options` VALUES ('34', 'true', '2022-11-30 16:13:21', '阿松大', '123@qq.com', '2022-12-01 15:52:10', 'true', '<p>阿松大</p>', 'admin', '3833597f-e5ca-4e63-b976-2494fddb1bb9', 'false');
INSERT INTO `postal_options` VALUES ('35', 'true', '2022-11-30 16:17:09', '阿松大', '123@qq.com', '2022-12-01 15:52:10', 'true', '<p>阿松大</p>', 'admin', 'fc57fe50-c538-4fe8-8a77-197f25744713', 'false');
INSERT INTO `postal_options` VALUES ('36', 'true', '2022-11-30 16:28:18', 'asdf12313', '9123232@qq.com', '2022-12-01 16:27:56', 'true', '<p>asdasd as Ad 123</p>', 'admin', '7c252860-5b5d-4cce-9f68-df4ca60e576a', 'false');
INSERT INTO `postal_options` VALUES ('37', 'true', '2022-11-30 16:31:15', 'asdf12313', '9123232@qq.com', '2022-12-01 16:27:56', 'true', '<p>asdasd as Ad 123</p>', 'admin', 'defaa1ba-6032-49de-80ec-73871c0ee472', 'false');
INSERT INTO `postal_options` VALUES ('38', 'true', '2022-11-30 16:34:05', 'qweqwe', 'qwe@qq.com', '2022-12-01 16:33:55', 'false', '<p>asdasd</p>', 'admin', 'a88638d7-5309-4abf-bfc6-4cafa4fa6b1e', 'false');
INSERT INTO `postal_options` VALUES ('39', 'true', '2022-11-30 16:37:03', '123123', '912323520@qq.com', '2022-12-02 16:36:54', 'false', '<p>啊实打实的</p>', 'admin', 'eb2e498b-c021-49e4-9d90-339edb5cf777', 'false');
INSERT INTO `postal_options` VALUES ('40', 'true', '2022-12-01 10:40:10', 'asdasdadasdasdadasdads', '912323520@qq.com', '2022-12-02 10:39:57', 'true', '<p>asd</p>', 'admin', 'b057f0d6-9eb0-4323-a3b0-1217effea073', 'false');
INSERT INTO `postal_options` VALUES ('41', 'true', '2022-12-01 11:51:55', '啊实打实的', '912323520@qq.com', '2023-01-01 11:51:35', 'false', '<p>阿松大</p>', 'admin', 'b9783e7b-7cfc-4ed5-88f5-c676ba3d17b6', 'false');
INSERT INTO `postal_options` VALUES ('42', 'true', '2022-12-01 14:42:39', '得到充分v把你后面就,', '912323520@qq.com', '2023-01-06 14:42:30', 'false', '<p>啊实打实大苏打</p>', 'admin', '9b67edf0-399f-4db3-934e-38eb5135974b', 'false');
INSERT INTO `postal_options` VALUES ('43', 'true', '2022-12-01 16:04:48', '123123', '912323520@qq.com', '2023-01-01 16:04:34', 'true', '<p>的风格斯大法官</p>', 'admin', 'c70c8bab-5f77-4fb9-baee-1159ba7ebacc', 'false');
INSERT INTO `postal_options` VALUES ('44', 'true', '2022-12-01 16:07:09', '123123', '912323520@qq.com', '2023-01-01 16:06:26', 'false', '<p>   asd asd ASd asASDF ASDF 啊手动阀 啊手<span class=\"ql-size-huge\">动阀手动阀阿斯顿发生阿道夫啊手</span><span class=\"ql-size-huge ql-font-serif\">动阀aasdf</span><img src=\"http://127.0.0.1:3001/avatar/asd.jpg\"></p>', 'admin', 'a3e60696-d743-4e7e-8ad1-44cfa28f0271', 'false');
INSERT INTO `postal_options` VALUES ('45', 'true', '2022-12-01 16:41:03', '啊手动阀手动阀', '912323520@qq.com', '2023-01-01 16:39:47', 'true', '<p><img style=\'max-width:max-width: 1.5rem;max-height: 1.5rem;vertical-align: baseline;\' src=\"http://127.0.0.1:3001/avatar/yo.jpeg\">asdfasdfasa<span class=\"ql-size-small\">sdfasdfasdfasdfasdfasfasdfasdfasdf </span>&nbsp;<span style=\"color: rgb(156, 220, 254);\">啊手动阀阿三阿松大</span><span style=\"color: rgb(156, 220, 254);\" class=\"ql-size-large\">阿萨大大俺的</span><img style=\'max-width:max-width: 1.5rem;max-height: 1.5rem;vertical-align: baseline;\' src=\"http://127.0.0.1:3001/avatar/asd.jpg\"></p>', 'admin', '150137ba-a7fa-4cf7-875e-032bba1943be', 'false');
