#Author: Preston Tighe

DROP DATABASE IF EXISTS SMUAdminConsole;
CREATE DATABASE IF NOT EXISTS SMUAdminConsole;
USE SMUAdminConsole;

ALTER SCHEMA SMUAdminConsole DEFAULT CHARACTER SET utf8mb4;
GRANT ALL ON SMUAdminConsole.* TO `admin`@localhost IDENTIFIED BY '8043v36m807c3084m6m03v';

#__________________________________________________________________________________
CREATE TABLE users (
	uid 					INT NOT NULL AUTO_INCREMENT,
	first_name				VARCHAR(40),
	last_name				VARCHAR(40),
	username					VARCHAR(100), #email
  password				VARCHAR(255),
	`type`					int, 						# 1 = admin, 2 = manager
	date_start				timestamp DEFAULT CURRENT_TIMESTAMP,
	date_banned_till		timestamp,
	profile_picture_url		VARCHAR(400),
	ip 						VARCHAR(40),
	active        			tinyint(1) DEFAULT 1,

	PRIMARY KEY				(uid)
);
#__________________________________________________________________________________
CREATE TABLE api_keys (
	id 						int(11) NOT NULL AUTO_INCREMENT,
	uid 					int,
	email 				varchar(40),
	api_key 				varchar(60) NOT NULL,						
	level 					int(2) NOT NULL,
	ignore_limits			tinyint(1) NOT NULL DEFAULT 0,
	is_private_key 			tinyint(1)  NOT NULL DEFAULT 0,
	ip_addresses 			TEXT NULL DEFAULT NULL,
	date_created 			timestamp DEFAULT CURRENT_TIMESTAMP,
	active					tinyint(1) NOT NULL DEFAULT 1,
	PRIMARY KEY (id),
	FOREIGN KEY 			(uid) REFERENCES users(uid) ON DELETE CASCADE
);
#__________________________________________________________________________________
CREATE TABLE globals (
	id						INT NOT NULL AUTO_INCREMENT,
	object					VARCHAR(40),
	action					VARCHAR(40),
	active					int NOT NULL DEFAULT 1,
	message					text,
	PRIMARY KEY				(id)
);
#__________________________________________________________________________________
CREATE TABLE password_resets (
	id						INT NOT NULL AUTO_INCREMENT,
	token					VARCHAR(40),
	uid						int,
	date_created			timestamp DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY				(id),
	FOREIGN KEY 			(uid) REFERENCES users(uid) ON DELETE CASCADE
);
#__________________________________________________________________________________
CREATE TABLE user_failed_login_history (
	id 						INT NOT NULL AUTO_INCREMENT,	
	attempts 				INT,
	ip						VARCHAR(40),
	uid 					int,
	last_attempt_date		timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY				(id),
	FOREIGN KEY 			(uid) REFERENCES users(uid) ON DELETE CASCADE
);
#__________________________________________________________________________________
CREATE TABLE user_login_history (
	login_history_id 		INT NOT NULL AUTO_INCREMENT,	
	ip 						VARCHAR(40),
	uid 					int,
	date_logged				timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY				(login_history_id),
	FOREIGN KEY 			(uid) REFERENCES users(uid) ON DELETE CASCADE
);
#__________________________________________________________________________________
CREATE TABLE roms (
	gid		INT NOT NULL AUTO_INCREMENT,
	game_name		TEXT NOT NULL,
	file_name		TEXT NOT NULL,
	rom_loc		TEXT NOT NULL,
	rom_active		BOOLEAN,
	game_time_played		INTEGER,
	game_last_active		DATETIME,
	last_edit_id		INTEGER,
	image_loc			TEXT,
  game_desc			TEXT,
	PRIMARY KEY				(gid),
	FOREIGN KEY 			(last_edit_id) REFERENCES users(uid)
);
#__________________________________________________________________________________
# this table is a list of all the possible roms that work with Mame4All, this is mainly for getting the names
CREATE TABLE possible_roms (
	pgid		INT NOT NULL AUTO_INCREMENT,
	file_name		TEXT NOT NULL,
	game_name		TEXT NOT NULL,
	PRIMARY KEY				(pgid)
);


INSERT into globals(object,action,active) values ('SMUAdminConsole','login',1);
