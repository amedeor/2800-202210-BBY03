"use strict;"

const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const { JSDOM } = require("jsdom");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "16Cg0DV69kfYRrpfOBZsz8xi8cmwMN1TzjQLoHGNIh5DCEDgP5",
  name: "foodForLessSessionId",
  resave: false,
  saveUninitialized: true
})
);

app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));

app.get("/", (req, res) => {
  if (req.session.loggedIn === true) {
    res.redirect("/profile");
  } else {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");
    res.send(doc);
  }
});

app.get("/profile", async (req, res) => {
  if (req.session.loggedIn === true && req.session.user_type === "admin") {

    let users = fs.readFileSync("./app/html/users.html", "utf-8");
    let usersDOM = new JSDOM(users);

    let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM bby03_user");

    console.log(results);


    

    res.send(usersDOM.serialize());
  }
});


app.get("/profile", async (req, res) => {
  if (req.session.loggedIn === true) {

    if (req.session.usertype === "regular") {
      let profile = fs.readFileSync("./app/html/profile.html", "utf-8");

      let profileDOM = new JSDOM(profile);

      let avatarImage = profileDOM.window.document.createElement("img");
      avatarImage.setAttribute("src", req.session.avatarUrl);
      avatarImage.setAttribute("alt", "Avatar image");
      avatarImage.setAttribute("class", "profile-info-piece avatar-image");
  
      let usernameParagraph = profileDOM.window.document.createElement("p");
      usernameParagraph.setAttribute("class", "profile-info-piece username");

      let firstNameParagraph = profileDOM.window.document.createElement("p");
      firstNameParagraph.setAttribute("class", "profile-info-piece");

      let lastNameParagraph = profileDOM.window.document.createElement("p");
      lastNameParagraph.setAttribute("class", "profile-info-piece");

      let emailParagraph = profileDOM.window.document.createElement("p");
      emailParagraph.setAttribute("class", "profile-info-piece");

      let userTypeParagraph = profileDOM.window.document.createElement("p");
      userTypeParagraph.setAttribute("class", "profile-info-piece");
  
      usernameParagraph.insertAdjacentText("beforeend", `${req.session.username}`);
      firstNameParagraph.insertAdjacentText("beforeend", `First Name: ${req.session.firstName}`);
      lastNameParagraph.insertAdjacentText("beforeend", `Last Name: ${req.session.lastName}`);
      emailParagraph.insertAdjacentText("beforeend", `Email: ${req.session.email}`);
      userTypeParagraph.insertAdjacentText("beforeend", `User type: ${req.session.usertype}`);
  
      let profileInfoElement = profileDOM.window.document.querySelector("#profile-info");
  
      profileInfoElement.insertAdjacentElement("beforeend", avatarImage);
      profileInfoElement.insertAdjacentElement("beforeend", usernameParagraph);
      profileInfoElement.insertAdjacentElement("beforeend", firstNameParagraph);
      profileInfoElement.insertAdjacentElement("beforeend", lastNameParagraph);
      profileInfoElement.insertAdjacentElement("beforeend", emailParagraph);
      profileInfoElement.insertAdjacentElement("beforeend", userTypeParagraph);
  
      res.send(profileDOM.serialize());

    } else if (req.session.usertype === "admin") {
      let adminProfile = fs.readFileSync("./app/html/adminprofile.html", "utf-8");

      let profileDOM = new JSDOM(adminProfile);
  
      let avatarImage = profileDOM.window.document.createElement("img");
      avatarImage.setAttribute("src", req.session.avatarUrl);
      avatarImage.setAttribute("alt", "Avatar image");
      avatarImage.setAttribute("class", "profile-info-piece avatar-image");
  
      let usernameParagraph = profileDOM.window.document.createElement("p");
      usernameParagraph.setAttribute("class", "profile-info-piece username");

      let firstNameParagraph = profileDOM.window.document.createElement("p");
      firstNameParagraph.setAttribute("class", "profile-info-piece");

      let lastNameParagraph = profileDOM.window.document.createElement("p");
      lastNameParagraph.setAttribute("class", "profile-info-piece");

      let emailParagraph = profileDOM.window.document.createElement("p");
      emailParagraph.setAttribute("class", "profile-info-piece");

      let userTypeParagraph = profileDOM.window.document.createElement("p");
      userTypeParagraph.setAttribute("class", "profile-info-piece");
  
      usernameParagraph.insertAdjacentText("beforeend", `${req.session.username}`);
      firstNameParagraph.insertAdjacentText("beforeend", `First Name: ${req.session.firstName}`);
      lastNameParagraph.insertAdjacentText("beforeend", `Last Name: ${req.session.lastName}`);
      emailParagraph.insertAdjacentText("beforeend", `Email: ${req.session.email}`);
      userTypeParagraph.insertAdjacentText("beforeend", `User type: ${req.session.usertype}`);
  
      let profileInfoElement = profileDOM.window.document.querySelector("#profile-info");
  
      profileInfoElement.insertAdjacentElement("beforeend", avatarImage);
      profileInfoElement.insertAdjacentElement("beforeend", usernameParagraph);
      profileInfoElement.insertAdjacentElement("beforeend", firstNameParagraph);
      profileInfoElement.insertAdjacentElement("beforeend", lastNameParagraph);
      profileInfoElement.insertAdjacentElement("beforeend", emailParagraph);
      profileInfoElement.insertAdjacentElement("beforeend", userTypeParagraph);

      res.send(profileDOM.serialize());
    }    
  } else {
    res.redirect("/");
  }
}
);

app.get("/signup", async (req, res) => {

      let signup = fs.readFileSync("./app/html/signup.html", "utf-8");

      console.log("Regular profile loaded");

      let signupDOM = new JSDOM(signup);

  
      res.send(signupDOM.serialize());

    }

);

app.post("/login", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let username = req.body.username;
  let password = req.body.password;

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });

  let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM bby03_user WHERE user_username = ? AND user_password = ?", [username, password]);

  
  if (results.length === 0) {
    res.send({ "status": "fail", "message": "Incorrect username or password" });
  } else {

    let retrievedUser = results[0];

    let retrievedUserId = retrievedUser.user_id;
    let retrievedUsername = retrievedUser.user_username;
    let retrievedPassword = retrievedUser.user_password;
    let retrievedFirstName = retrievedUser.user_firstname;
    let retrievedLastName = retrievedUser.user_lastname;
    let retrievedEmail = retrievedUser.user_email;
    let retrievedUserType = retrievedUser.user_type;
    let retrievedAvatarUrl = retrievedUser.user_avatar_url;

    req.session.loggedIn = true;

    req.session.username = retrievedUsername;
    req.session.firstName = retrievedFirstName;
    req.session.lastName = retrievedLastName;
    req.session.email = retrievedEmail;
    req.session.usertype = retrievedUserType;
    req.session.avatarUrl = retrievedAvatarUrl;

    res.send({ status: "success", message: "Logged in" });
  }
});

app.get("/logout", function (req, res) {
  if (req.session) {
      req.session.destroy(error => {
          if (error) {
              res.status(400).send("Error: Can't sign out");
          } else {
              res.redirect("/");
          }
      });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log("Application is listening on port 8000!");
});