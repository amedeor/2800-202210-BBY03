# FoodForLess

## Project description

FoodForLess is a web application developed by Team BBY-03 to help low-income earners save money on groceries by allowing them to share the deals they see in stores and view deals posted by other users.

## 2800-202210-BBY03 

This program is made by 2800-202210-BBY03.

## Project technologies

Technologies used for this project:

1. Frontend
    * HTML 5 
    * CSS 3
    * JavaScript (ES6)
    * NicEdit 0.9 r25
    * jQuery 3.6.0
    * jQuery UI 1.12.1

2. Backend
    * Node.js version 16.14.0
    * express version 4.18.1
    * express-session 1.17.3
    * multer 1.4.4
    * jsdom 19.0.0
    * mysql2 2.3.3
    
3. Database
    * MySQL (MariaDB) Ver 15.1 Distrib 10.4.24-MariaDB

4. Other tools
    * Visual Studio Code
    * XAMPP (Used for MySQL (MariaDB))

## List of file contents in project folder
.
├── app
│   └── html
│       ├── adminprofile.html
│       ├── browsedeals.html
│       ├── index.html
│       ├── profile.html
│       ├── signup.html
│       └── users.html
├── COMP2800.sql
├── foodforless.js
├── package.json
├── package-lock.json
├── public
│   ├── css
│   │   ├── browsedeals.css
│   │   ├── deals.css
│   │   ├── easter_egg.css
│   │   ├── editdeal.css
│   │   ├── editimage.css
│   │   ├── main-style.css
│   │   ├── navbar.css
│   │   ├── postdeal.css
│   │   ├── profile.css
│   │   ├── style.css
│   │   └── users.css
│   ├── img
│   │   ├── add-icon.svg
│   │   ├── avatar1.svg
│   │   ├── avatar2.svg
│   │   ├── avatar3.svg
│   │   ├── avatar4.svg
│   │   ├── avatar5.svg
│   │   ├── avatar6.svg
│   │   ├── default-avatar.svg
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   ├── list-icon.svg
│   │   ├── login-background.jpg
│   │   ├── logout-icon.svg
│   │   ├── magnifying-glass-icon.svg
│   │   └── profile-icon.svg
│   └── js
│       ├── browsedeals.js
│       ├── client.js
│       ├── postdeal.js
│       ├── profile.js
│       └── users.js
└── README.md

## Installing and running the project

1. Software and languages required
    a) HTML
    b) JavaScript
    c) CSS
    d) MySQL (MariaDB)

2. APIs and Frameworks required
    a) Node.js 
    b) express (Node.js module)
    c) express-session (Node.js module)
    d) mysql2 (Node.js module)
    e) multer (Node.js module)
    f) JSDOM (Node.js module)
    g) NicEdit

3. Configuration
    a) Clone the repository from the main branch
    b) Install MySQL server (You can install XAMPP which includes MySQL server)
    c) Run all the SQL queries in the code from the COMP2800.sql file as a root user on your MySQL server instance. This will create the required database and tables to run the application.
    d) Install Node.js
    e) Install all the requirede Node.js modules globally using the following commands:
        npm -install -g express
        npm -install -g express-session
        npm -install -g mysql2
        npm -install -g multer
        npm -install -g jsdom
    f) Start your MySQL server instance
    g) From the command line, change directory to the root of the project folder and start the application by running the command: node foodforless.js
    h) Open a web browser and go to localhost:8000 (The application runs on port 8000 by default)
    i) You can now login with an administrator account or regular user account using the credentials specified in the useraccounts.txt file

4. [Testing plan/log](https://docs.google.com/spreadsheets/d/1hT7aN8KcQ0bGoOxY-3B9k68t5wRmzynt-ZkHXiF6c48/edit#gid=394496370)

5. How to use our application
    a) Log in as a regular user or administrator user with the credentials provided in the passwords.txt file.
    b) After successful login you will be directed to your profile page.
    c) From the profile page, an administrator user account can post deals, access an administrator dashboard to manage other user accounts, and update their profile information. From the profile page, a regular user account can post deals and update their profile information.
    d) To browse deals posted by all other users, click the "Browse" link in the navbar.
    e) To create a new user account, click the "Create an account" link on the homepage.

## Credits and references

* [jQuery](https://jquery.com/)
* [jQuery UI](https://jqueryui.com/)
* [NicEdit](https://nicedit.com/)
* [How to calculate time zone offset in JavaScript](https://stackoverflow.com/questions/7403486/add-or-subtract-timezone-difference-to-javascript-date)
* [How to center a jQuery UI modal after browser window resize](https://stackoverflow.com/questions/3060146/how-to-auto-center-jquery-ui-dialog-when-resizing-browser)

## Contact Information

We can be contacted by email at: comp2800teambby03@gmail.com
