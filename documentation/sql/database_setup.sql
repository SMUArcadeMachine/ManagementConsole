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
	username 				varchar(40),
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

CREATE TABLE oauth_clients (
	client_id VARCHAR(80) NOT NULL,
	client_secret VARCHAR(80),
	redirect_uri VARCHAR(2000) NOT NULL,
	grant_types VARCHAR(80),
	scope VARCHAR(100),
	user_id VARCHAR(80),
	CONSTRAINT clients_client_id_pk PRIMARY KEY (client_id)
);
CREATE TABLE oauth_access_tokens (
	access_token VARCHAR(40) NOT NULL,
	client_id VARCHAR(80) NOT NULL,
	user_id VARCHAR(255),
	expires TIMESTAMP NOT NULL,
	scope VARCHAR(2000),
	CONSTRAINT access_token_pk PRIMARY KEY (access_token)
);
CREATE TABLE oauth_authorization_codes (
	authorization_code VARCHAR(40) NOT NULL,
	client_id VARCHAR(80) NOT NULL,
	user_id VARCHAR(255),
	redirect_uri VARCHAR(2000),
	expires TIMESTAMP NOT NULL,
	scope VARCHAR(2000),
	CONSTRAINT auth_code_pk PRIMARY KEY (authorization_code)
);
CREATE TABLE oauth_refresh_tokens (
	refresh_token VARCHAR(40) NOT NULL,
	client_id VARCHAR(80) NOT NULL,
	user_id VARCHAR(255),
	expires TIMESTAMP NOT NULL,
	scope VARCHAR(2000),
	CONSTRAINT refresh_token_pk PRIMARY KEY (refresh_token)
);
CREATE TABLE oauth_users (
	username VARCHAR(255) NOT NULL,
	password VARCHAR(2000),
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	CONSTRAINT username_pk PRIMARY KEY (username
	));
CREATE TABLE oauth_scopes (
	scope TEXT,
	is_default BOOLEAN
);
CREATE TABLE oauth_jwt (
	client_id VARCHAR(80) NOT NULL,
	subject VARCHAR(80),
	public_key VARCHAR(2000),
	CONSTRAINT jwt_client_id_pk PRIMARY KEY (client_id)
);

