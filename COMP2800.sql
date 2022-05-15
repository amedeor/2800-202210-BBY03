CREATE DATABASE IF NOT EXISTS COMP2800;
use COMP2800;

CREATE TABLE IF NOT EXISTS BBY_03_user(
    user_id int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (user_id),
    user_username VARCHAR(50) NOT NULL ,
    user_firstname VARCHAR(50) NOT NULL ,
    user_lastname VARCHAR(50) NOT NULL,
    user_email VARCHAR(50) NOT NULL,
    user_password VARCHAR(50) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    user_avatar_url VARCHAR(80) NOT NULL
);

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(1, 'bgreen', 'Bill', 'Green', 'bgreen@email.com', 'password123', 'admin', '/img/avatar1.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(2, 'swhite', 'Sally', 'White', 'swhite@email.com', 'password123', 'admin', '/img/avatar2.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(3, 'bsmith', 'Bob', 'Smith', 'bsmith@email.com', 'password123', 'regular', '/img/avatar3.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(4, 'tbrown', 'Tim', 'Brown', 'tbrown@email.com', 'password123', 'regular', '/img/avatar4.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(5, 'eblack', 'Emily', 'Black', 'eblack@email.com', 'password123', 'regular', '/img/avatar5.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(6, 'jwilson', 'John', 'Wilson', 'jwilson@email.com', 'password123', 'regular', '/img/avatar6.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(7, 'jack', 'jack', 'jack', 'jack@email.com', 'jack', 'admin', '/img/avatar2.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(8, 'shayan', 'zahedanraki', 'Shayan', 'Shayan@email.com', 'shayan', 'admin', '/img/avatar4.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(9, 'john', 'John', 'john', 'john@email.com', 'john', 'regular', '/img/avatar6.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(10, 'micheal', 'micheal', 'micheal', 'micheal@email.com', 'micheal', 'regular', '/img/avatar5.svg');

INSERT INTO BBY_03_user (user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) VALUES 
(11, 'witch', 'witch', 'witch', 'witch@email.com', 'witch', 'regular', '/img/avatar6.svg');


CREATE TABLE IF NOT EXISTS BBY_03_deal(
    deal_id int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (user_id),
    deal_name VARCHAR(50) NOT NULL ,
    deal_price VARCHAR(50) NOT NULL ,
    deal_description VARCHAR(200) NOT NULL,
    deal_expiry_date DATE NOT NULL,
    user_password VARCHAR(50) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    user_avatar_url VARCHAR(80) NOT NULL
);