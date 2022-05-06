"use strict;"

const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const { JSDOM } = require("jsdom");
const mysql = require("mysql2/promise");

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
  if (req.session.loggedIn === true) {

    if (req.session.usertype === "regular") {
      let profile = fs.readFileSync("./app/html/profile.html", "utf-8");

      let profileDOM = new JSDOM(profile);

      let avatar = profileDOM.window.document.createElement("div");
      avatar.setAttribute("class", "avatar");

      let avatarImage = profileDOM.window.document.createElement("img");
      avatarImage.setAttribute("src", req.session.avatarUrl);
      avatarImage.setAttribute("alt", "Avatar image");
      avatarImage.setAttribute("class", "profile-info-piece avatar-image");

      let profileText = profileDOM.window.document.createElement("div");
      profileText.setAttribute("class", "profileText");

      let usernameParagraph = profileDOM.window.document.createElement("p");
      usernameParagraph.setAttribute("class", "profile-info-piece username");

      let firstNameParagraph = profileDOM.window.document.createElement("p");
      firstNameParagraph.setAttribute("class", "profile-info-piece firstName");

      let lastNameParagraph = profileDOM.window.document.createElement("p");
      lastNameParagraph.setAttribute("class", "profile-info-piece lastName");

      let emailParagraph = profileDOM.window.document.createElement("p");
      emailParagraph.setAttribute("class", "profile-info-piece email");

      let userTypeParagraph = profileDOM.window.document.createElement("p");
      userTypeParagraph.setAttribute("class", "profile-info-piece user-type");

      usernameParagraph.insertAdjacentText("beforeend", `${req.session.username}`);
      firstNameParagraph.insertAdjacentText("beforeend", `First Name: ${req.session.firstName}`);
      lastNameParagraph.insertAdjacentText("beforeend", `Last Name: ${req.session.lastName}`);
      emailParagraph.insertAdjacentText("beforeend", `Email: ${req.session.email}`);
      userTypeParagraph.insertAdjacentText("beforeend", `User type: ${req.session.usertype}`);

      let profileInfoElement = profileDOM.window.document.querySelector("#profile-info");

      profileInfoElement.insertAdjacentElement("beforeend", avatar);
      profileInfoElement.insertAdjacentElement("beforeend", profileText);

      let avatarElement = profileDOM.window.document.querySelector(".avatar");

      avatarElement.insertAdjacentElement("beforeend", avatarImage);
      avatarElement.insertAdjacentElement("beforeend", usernameParagraph);

      let profileTextElement = profileDOM.window.document.querySelector(".profileText");

      profileTextElement.insertAdjacentElement("beforeend", firstNameParagraph);
      profileTextElement.insertAdjacentElement("beforeend", lastNameParagraph);
      profileTextElement.insertAdjacentElement("beforeend", emailParagraph);
      profileTextElement.insertAdjacentElement("beforeend", userTypeParagraph);

      res.send(profileDOM.serialize());

    } else if (req.session.usertype === "admin") {
      let adminProfile = fs.readFileSync("./app/html/adminprofile.html", "utf-8");

      console.log("Administrator profile loaded");

      let profileDOM = new JSDOM(adminProfile);

      let avatar = profileDOM.window.document.createElement("div");
      avatar.setAttribute("class", "avatar");

      let avatarImage = profileDOM.window.document.createElement("img");
      avatarImage.setAttribute("src", req.session.avatarUrl);
      avatarImage.setAttribute("alt", "Avatar image");
      avatarImage.setAttribute("class", "profile-info-piece avatar-image");

      let profileText = profileDOM.window.document.createElement("div");
      profileText.setAttribute("class", "profileText");

      let usernameParagraph = profileDOM.window.document.createElement("p");
      usernameParagraph.setAttribute("class", "profile-info-piece username");

      let firstNameParagraph = profileDOM.window.document.createElement("p");
      firstNameParagraph.setAttribute("class", "profile-info-piece firstName");

      let lastNameParagraph = profileDOM.window.document.createElement("p");
      lastNameParagraph.setAttribute("class", "profile-info-piece lastName");

      let emailParagraph = profileDOM.window.document.createElement("p");
      emailParagraph.setAttribute("class", "profile-info-piece email");

      let userTypeParagraph = profileDOM.window.document.createElement("p");
      userTypeParagraph.setAttribute("class", "profile-info-piece user-type");

      usernameParagraph.insertAdjacentText("beforeend", `${req.session.username}`);
      firstNameParagraph.insertAdjacentText("beforeend", `First Name: ${req.session.firstName}`);
      lastNameParagraph.insertAdjacentText("beforeend", `Last Name: ${req.session.lastName}`);
      emailParagraph.insertAdjacentText("beforeend", `Email: ${req.session.email}`);
      userTypeParagraph.insertAdjacentText("beforeend", `User type: ${req.session.usertype}`);

      let profileInfoElement = profileDOM.window.document.querySelector("#profile-info");

      profileInfoElement.insertAdjacentElement("beforeend", avatar);
      profileInfoElement.insertAdjacentElement("beforeend", profileText);

      let avatarElement = profileDOM.window.document.querySelector(".avatar");

      avatarElement.insertAdjacentElement("beforeend", avatarImage);
      avatarElement.insertAdjacentElement("beforeend", usernameParagraph);

      let profileTextElement = profileDOM.window.document.querySelector(".profileText");

      profileTextElement.insertAdjacentElement("beforeend", firstNameParagraph);
      profileTextElement.insertAdjacentElement("beforeend", lastNameParagraph);
      profileTextElement.insertAdjacentElement("beforeend", emailParagraph);
      profileTextElement.insertAdjacentElement("beforeend", userTypeParagraph);

      res.send(profileDOM.serialize());
    }
  } else {
    res.redirect("/");
  }
}
);

app.get("/signup", async (req, res) => {
  let signup = fs.readFileSync("./app/html/signup.html", "utf-8");
  let signupDOM = new JSDOM(signup);
  res.send(signupDOM.serialize());
});

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

app.post("/createUser", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let signupFName = req.body.signupFName;
  let signupLName = req.body.signupLName;
  let signupEmail = req.body.signupEmail;
  let signupUsername = req.body.signupUsername;
  let signupPassword = req.body.signupPassword;

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
  });

  //Check to see If a user with selected username or email exist.
  let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM bby03_user WHERE user_username = ? OR user_email = ?", [signupUsername, signupEmail]);

  if (results.length === 0) {

    let userRecord = "INSERT INTO bby03_user (user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) values (?)";

    let recordValues = [signupUsername, signupFName, signupLName, signupEmail, signupPassword, "regular", "/img/avatar1.svg"];

    //[recordValues] destructuring assignment recordValues are passed into ? in the userRecord SQL statement string
    await connection.query(userRecord, [recordValues]);

    req.session.loggedIn = true;

    req.session.username = recordValues[0];
    req.session.firstName = recordValues[1];
    req.session.lastName = recordValues[2];
    req.session.email = recordValues[3];
    req.session.usertype = recordValues[5];
    req.session.avatarUrl = recordValues[6];

    res.send({ status: "success", message: "Logged in" });
  } else {
    res.send({ "status": "fail", "message": "Email or Username is already in use" });
  }
});

app.get("/users", async (req, res) => {
  if (req.session.loggedIn === true && req.session.usertype === "admin") {

    let users = fs.readFileSync("./app/html/users.html", "utf-8");
    let usersDOM = new JSDOM(users);

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "COMP2800",
      multipleStatements: true
    });

    let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM bby03_user");

    console.log(results);

    let table = usersDOM.window.document.createElement("table");
    table.setAttribute("id", "users-table");

    let thead = usersDOM.window.document.createElement("thead");

    let tr = usersDOM.window.document.createElement("tr");

    let tbody = usersDOM.window.document.createElement("tbody");

    let userAccountsHeading = usersDOM.window.document.querySelector("#user-accounts-heading");

    let tableHeadings = ["Username", "First Name", "Last Name", "Email", "User Type", "Avatar"];

    for (let heading of tableHeadings) {
      let th = usersDOM.window.document.createElement("th");
      tr.insertAdjacentElement("beforeend", th);
      th.insertAdjacentText("afterbegin", heading);
    }

    userAccountsHeading.insertAdjacentElement("afterend", table);
    table.insertAdjacentElement("beforeend", thead);
    thead.insertAdjacentElement("beforeend", tr);
    thead.insertAdjacentElement("afterend", tbody);


    for (let user of results) {
      let userUsername = user.user_username;
      let userFirstname = user.user_firstname;
      let userLastname = user.user_lastname;
      let userEmail = user.user_email;
      let userType = user.user_type;
      let userAvatarUrl = user.user_avatar_url;

      let tr = usersDOM.window.document.createElement("tr");
      let tdUsername = usersDOM.window.document.createElement("td");
      let tdFirstName = usersDOM.window.document.createElement("td");
      let tdLastName = usersDOM.window.document.createElement("td");
      let tdEmail = usersDOM.window.document.createElement("td");
      let tdUserType = usersDOM.window.document.createElement("td");
      let tdUserAvatarUrl = usersDOM.window.document.createElement("td");

      tdUsername.insertAdjacentText("afterbegin", userUsername);
      tdFirstName.insertAdjacentText("afterbegin", userFirstname);
      tdLastName.insertAdjacentText("afterbegin", userLastname);
      tdEmail.insertAdjacentText("afterbegin", userEmail);
      tdUserType.insertAdjacentText("afterbegin", userType);
      tdUserAvatarUrl.insertAdjacentHTML("afterbegin", `<img src="${userAvatarUrl}" />`);

      tbody.insertAdjacentElement("beforeend", tr);

      tr.insertAdjacentElement("beforeend", tdUsername);
      tr.insertAdjacentElement("beforeend", tdFirstName);
      tr.insertAdjacentElement("beforeend", tdLastName);
      tr.insertAdjacentElement("beforeend", tdEmail);
      tr.insertAdjacentElement("beforeend", tdUserType);
      tr.insertAdjacentElement("beforeend", tdUserAvatarUrl);
    }

    res.send(usersDOM.serialize());
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