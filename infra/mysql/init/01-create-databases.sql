-- Local development databases and users.
-- Do not use these passwords in staging or production.

CREATE DATABASE IF NOT EXISTS `rumahkodingku_academy`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'academy_user'@'%'
  IDENTIFIED BY 'academy_password';

GRANT ALL PRIVILEGES ON `rumahkodingku_academy`.* TO 'academy_user'@'%';

FLUSH PRIVILEGES;
