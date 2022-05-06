CREATE DATABASE IF NOT EXISTS COMP2800;
use COMP2800;

CREATE TABLE IF NOT EXISTS bby03_user(
    user_id int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (user_id),
    user_username NOT NULL VARCHAR(50),
    user_firstname NOT NULL VARCHAR(50),
    user_lastname NOT NULL VARCHAR(50),
    user_email NOT NULL VARCHAR(50),
    user_password NOT NULL VARCHAR(50),
    user_type NOT NULL VARCHAR(50),
    user_avatar_url NOT NULL VARCHAR(80)
);

INSERT INTO bby03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES (1, 'bgreen', 'Bill', 'Green', 'bgreen@email.com', 'password123', 'admin', '/img/avatar1.svg');

INSERT INTO bby03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES (2, 'swhite', 'Sally', 'White', 'swith@email.com', 'password123', 'admin', '/img/avatar2.svg' );

INSERT INTO bby03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES (3, 'bsmith', 'Bob', 'Smith', 'bsmith@email.com', 'password123', 'regular', '/img/avatar3.svg' );

INSERT INTO bby03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES (4, 'tbrown', 'Tim', 'Brown', 'tbrown@email.com', 'password123', 'regular', '/img/avatar4.svg' );

INSERT INTO bby03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES (5, 'eblack', 'Emily', 'Black', 'eblack@email.com', 'password123', 'regular', '/img/avatar5.svg' );

INSERT INTO bby03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES (6, 'jwilson', 'John', 'Wilson', 'jwilson@email.com', 'password123', 'regular', '/img/avatar6.svg' );