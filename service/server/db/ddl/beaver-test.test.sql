CREATE TABLE `test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `message` varchar(1024) DEFAULT NULL,
  `state` tinyint(4) NOT NULL DEFAULT '1',
  `cts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uts` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
