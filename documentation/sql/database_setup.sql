#Author: Preston Tighe

DROP DATABASE IF EXISTS SMUAdminConsole;
CREATE DATABASE IF NOT EXISTS SMUAdminConsole;
USE SMUAdminConsole;

ALTER SCHEMA SMUAdminConsole DEFAULT CHARACTER SET utf8mb4;
GRANT ALL ON SMUAdminConsole.* TO `admin`@localhost IDENTIFIED BY '8043v36m807c3084m6m03v';

#__________________________________________________________________________________
CREATE TABLE users (
	uid 							INT NOT NULL AUTO_INCREMENT,
	first_name				VARCHAR(40),
	last_name					VARCHAR(40),
	username					VARCHAR(100), #email
  password					VARCHAR(255),
	`type`						int, 						# 1 = admin, 2 = manager
	date_start				timestamp DEFAULT CURRENT_TIMESTAMP,
	date_banned_till	timestamp,
	profile_picture_url		VARCHAR(400),
	ip 								VARCHAR(40),
	active        		tinyint(1) DEFAULT 1,

	PRIMARY KEY				(uid)
);
#__________________________________________________________________________________
CREATE TABLE api_keys (
	id 								int(11) NOT NULL AUTO_INCREMENT,
	uid 							int,
	username 					varchar(40),
	api_key 					varchar(60) NOT NULL,
	level 						int(2) NOT NULL,
	ignore_limits			tinyint(1) NOT NULL DEFAULT 0,
	is_private_key 		tinyint(1)  NOT NULL DEFAULT 0,
	ip_addresses 			TEXT NULL DEFAULT NULL,
	date_created 			timestamp DEFAULT CURRENT_TIMESTAMP,
	active						tinyint(1) NOT NULL DEFAULT 1,
	PRIMARY KEY 			(id),
	FOREIGN KEY 			(uid) REFERENCES users(uid) ON DELETE CASCADE
);
#__________________________________________________________________________________
CREATE TABLE globals (
	id								INT NOT NULL AUTO_INCREMENT,
	object						VARCHAR(40),
	action						VARCHAR(40),
	active						int NOT NULL DEFAULT 1,
	message						text,
	PRIMARY KEY				(id)
);
#__________________________________________________________________________________
CREATE TABLE password_resets (
	id								INT NOT NULL AUTO_INCREMENT,
	token							VARCHAR(40),
	uid								int,
	date_created			timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY				(id),
	FOREIGN KEY 			(uid) REFERENCES users(uid) ON DELETE CASCADE
);
#__________________________________________________________________________________
CREATE TABLE user_failed_login_history (
	id 								INT NOT NULL AUTO_INCREMENT,
	attempts 					INT,
	ip								VARCHAR(40),
	uid 							int,
	last_attempt_date	timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY				(id),
	FOREIGN KEY 			(uid) REFERENCES users(uid) ON DELETE CASCADE
);
#__________________________________________________________________________________
CREATE TABLE user_login_history (
	login_history_id 	INT NOT NULL AUTO_INCREMENT,
	ip 								VARCHAR(40),
	uid 							int,
	date_logged				timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY				(login_history_id),
	FOREIGN KEY 			(uid) REFERENCES users(uid) ON DELETE CASCADE
);
#__________________________________________________________________________________
CREATE TABLE roms (
	id		            INT NOT NULL AUTO_INCREMENT,
	game_name		      TEXT NOT NULL,
	file_name		      TEXT NOT NULL,
	rom_loc		        TEXT,
	rom_active		    BOOLEAN NOT NULL DEFAULT 0,
	game_time_played	INTEGER,
	game_last_active	DATETIME,
	last_edit_id		  INTEGER,
	image_loc			    TEXT,
	game_desc			    TEXT,
	PRIMARY KEY				(id),
	FOREIGN KEY 			(last_edit_id) REFERENCES users(uid)
);
#__________________________________________________________________________________
CREATE TABLE possible_roms (
	id		            INT NOT NULL AUTO_INCREMENT,
	game_name		      TEXT NOT NULL,
	file_name		      TEXT NOT NULL,
	rom_loc		        TEXT,
	rom_active		    BOOLEAN NOT NULL DEFAULT 0,
	game_time_played	INTEGER,
	game_last_active	DATETIME,
	last_edit_id		  INTEGER,
	image_loc			    TEXT,
	game_desc			    TEXT,
	PRIMARY KEY				(id),
	FOREIGN KEY 			(last_edit_id) REFERENCES users(uid)
);
#__________________________________________________________________________________
CREATE TABLE game_data(
	time_start        TIME,
	time_end          TIME,
	time_played       TIME,
	game_name         VARCHAR(50),
	counts            int
);

INSERT INTO SMUAdminConsole.users (first_name, last_name, username, password, type, date_start, date_banned_till, profile_picture_url, ip, active) VALUES (null, null, 'test@yahoo.com', '$2y$10$nqQQal7HpSNrXkomAJOR0uJRlWMEQCLA.sQbTZXccEwxsX0YOU9B6', 1, '2016-10-03 02:41:49', '2016-10-03 02:41:49', 'https://www.gravatar.com/avatar/88e478531ab3bc303f1b5da82c2e9bbb?s=80&d=identicon&r=g', '10.0.0.39', 1);
INSERT INTO SMUAdminConsole.users (first_name, last_name, username, password, type, date_start, date_banned_till, profile_picture_url, ip, active) VALUES (null, null, 'test2@yahoo.com', '$2y$10$h.8/kX26bI8kpEE4pgRPCu8iXuqccY9Tv8l8ssxPvo.AzKhboiFJ6', 2, '2016-10-03 02:46:29', '2016-10-03 02:46:29', 'https://www.gravatar.com/avatar/428907f641fa53ea2d3e4e9d2944d54c?s=80&d=identicon&r=g', '10.0.0.39', 1);
INSERT INTO SMUAdminConsole.users (first_name, last_name, username, password, type, date_start, date_banned_till, profile_picture_url, ip, active) VALUES (null, null, 'kkrummeck@smu.edu', '$2y$10$h.8/kX26bI8kpEE4pgRPCu8iXuqccY9Tv8l8ssxPvo.AzKhboiFJ6', 1, '2016-10-03 02:46:29', '2016-10-03 02:46:29', 'https://www.gravatar.com/avatar/428907f641fa53ea2d3e4e9d2944d54c?s=80&d=identicon&r=g', '10.0.0.39', 1);
INSERT INTO SMUAdminConsole.users (first_name, last_name, username, password, type, date_start, date_banned_till, profile_picture_url, ip, active) VALUES (null, null, 'rcrum@smu.edu', '$2y$10$h.8/kX26bI8kpEE4pgRPCu8iXuqccY9Tv8l8ssxPvo.AzKhboiFJ6', 1, '2016-10-03 02:46:29', '2016-10-03 02:46:29', 'https://www.gravatar.com/avatar/428907f641fa53ea2d3e4e9d2944d54c?s=80&d=identicon&r=g', '10.0.0.39', 1);
INSERT INTO SMUAdminConsole.users (first_name, last_name, username, password, type, date_start, date_banned_till, profile_picture_url, ip, active) VALUES (null, null, 'mfonten@lyle.smu.edu', '$2y$10$h.8/kX26bI8kpEE4pgRPCu8iXuqccY9Tv8l8ssxPvo.AzKhboiFJ6', 1, '2016-10-03 02:46:29', '2016-10-03 02:46:29', 'https://www.gravatar.com/avatar/428907f641fa53ea2d3e4e9d2944d54c?s=80&d=identicon&r=g', '10.0.0.39', 1);
