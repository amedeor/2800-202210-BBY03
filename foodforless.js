"use strict;"

const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const { JSDOM } = require("jsdom");
const mysql = require("mysql2/promise");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/img");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
})

const upload = multer({ storage: storage });

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

app.get("/get-user", async (req, res) => {

  let username = req.session.username;

  const connection = await mysql.createConnection({
    host: "us-cdbr-east-05.cleardb.net",
    user: "b836f8ec5d5bac",
    password: "732ab9c0",
    database: "heroku_024b43865916c4a",
    multipleStatements: true
  });

  let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM BBY_03_user WHERE user_username = ?", [username], function (error, results, fields) {
    if (error) {
      console.log(error);
    }
  });

  res.send({ status: "success", rows: results });

  console.log('Rows returned are: ', results);

  connection.end();
});





//the argument to single is the name of the HTML input that is uploading the file
app.post("/upload-image", upload.single("file"), async (req, res) => {

  if (req.file != undefined) {
    let savedFileName = `/img/${req.file.filename}`;
    let username = req.body.username;

    console.log(savedFileName);
    console.log(username);

    const connection = await mysql.createConnection({
      host: "us-cdbr-east-05.cleardb.net",
      user: "b836f8ec5d5bac",
      password: "732ab9c0",
      database: "heroku_024b43865916c4a",
      multipleStatements: true
    });

    await connection.connect();
    let [results, fields] = await connection.query("UPDATE BBY_03_user SET user_avatar_url = ? WHERE user_username = ?",
      [savedFileName, username],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }
      });

    //update session variable with new profile picture URL
    req.session.avatarUrl = savedFileName;


    res.send({ "status": "success", "message": "Image uploaded successfully." })
  }

});








app.get("/profile", async (req, res) => {
  if (req.session.loggedIn === true) {

    if (req.session.usertype === "regular") {
      let profile = fs.readFileSync("./app/html/profile.html", "utf-8");

      let profileDOM = new JSDOM(profile);

      // let imageUploadForm = profileDOM.window.document.createElement("form");
      // imageUploadForm.setAttribute("id", "image-upload-form");

      // let imageUploadInput = profileDOM.window.document.createElement("input");
      // imageUploadInput.setAttribute("id", "image-upload-input");
      // imageUploadInput.setAttribute("type", "file");
      // imageUploadInput.setAttribute("value", "Change Avatar Picture");
      // imageUploadInput.setAttribute("accept", "image/png, image/gif, image/jpeg, image/svg+xml");
      // //imageUploadInput.setAttribute("name", "image");

      // let imageFormSubmitButton = profileDOM.window.document.createElement("input");
      // imageFormSubmitButton.setAttribute("id", "photo-upload-submit-button");
      // imageFormSubmitButton.setAttribute("type", "submit");
      // imageFormSubmitButton.setAttribute("value", "Submit");


      // // let imageUploadForm = profileDOM.window.document.createElement("form");
      // // imageUploadForm.setAttribute("id", "image-upload-form");
      // // imageUploadForm.setAttribute("method", "post");
      // // imageUploadForm.setAttribute("action", "/upload-image")
      // // imageUploadForm.setAttribute("enctype", "/multipart/form-data")

      // // let imageUploadInput = profileDOM.window.document.createElement("input");
      // // imageUploadInput.setAttribute("id", "image-upload-input");
      // // imageUploadInput.setAttribute("type", "file");
      // // //imageUploadInput.setAttribute("value", "Change Avatar Picture");
      // // imageUploadInput.setAttribute("accept", "image/png, image/gif, image/jpeg, image/svg+xml");
      // // imageUploadInput.setAttribute("name", "image");

      // // let imageFormSubmitButton = profileDOM.window.document.createElement("input");
      // // imageFormSubmitButton.setAttribute("id", "photo-upload-submit-button");
      // // imageFormSubmitButton.setAttribute("type", "submit");
      // // imageFormSubmitButton.setAttribute("value", "Submit");

      // imageUploadForm.insertAdjacentElement("beforeend", imageUploadInput);
      // imageUploadForm.insertAdjacentElement("beforeend", imageFormSubmitButton);

      let avatarImage = profileDOM.window.document.createElement("img");
      avatarImage.setAttribute("src", req.session.avatarUrl);
      avatarImage.setAttribute("alt", "Avatar image");
      avatarImage.setAttribute("class", "profile-info-piece avatar-image");

      let usernameParagraph = profileDOM.window.document.createElement("p");
      usernameParagraph.setAttribute("class", "profile-info-piece");

      let usernameSpan = profileDOM.window.document.createElement("span");
      usernameSpan.setAttribute("class", "profile-info-piece username");

      let firstNameParagraph = profileDOM.window.document.createElement("p");
      firstNameParagraph.setAttribute("class", "profile-info-piece");

      let firstNameSpan = profileDOM.window.document.createElement("span");
      firstNameSpan.setAttribute("class", "profile-info-piece firstName");

      let lastNameParagraph = profileDOM.window.document.createElement("p");
      lastNameParagraph.setAttribute("class", "profile-info-piece");

      let lastNameSpan = profileDOM.window.document.createElement("span");
      lastNameSpan.setAttribute("class", "profile-info-piece lastName");

      let emailParagraph = profileDOM.window.document.createElement("p");
      emailParagraph.setAttribute("class", "profile-info-piece");

      let emailSpan = profileDOM.window.document.createElement("span");
      emailSpan.setAttribute("class", "profile-info-piece email");

      let passwordParagraph = profileDOM.window.document.createElement("p");
      passwordParagraph.setAttribute("class", "profile-info-piece");

      let passwordSpan = profileDOM.window.document.createElement("span");
      passwordSpan.setAttribute("class", "profile-info-piece password");

      let userTypeParagraph = profileDOM.window.document.createElement("p");
      userTypeParagraph.setAttribute("class", "profile-info-piece");

      let userTypeSpan = profileDOM.window.document.createElement("span");
      userTypeSpan.setAttribute("class", "profile-info-piece user-type");

      usernameParagraph.insertAdjacentText("beforeend", "");
      usernameSpan.insertAdjacentText("beforeend", req.session.username);

      firstNameParagraph.insertAdjacentText("beforeend", `First Name: `);
      firstNameSpan.insertAdjacentText("beforeend", req.session.firstName);

      lastNameParagraph.insertAdjacentText("beforeend", `Last Name: `);
      lastNameSpan.insertAdjacentText("beforeend", req.session.lastName);

      emailParagraph.insertAdjacentText("beforeend", `Email: `);
      emailSpan.insertAdjacentText("beforeend", req.session.email);

      passwordParagraph.insertAdjacentText("beforeend", `Password: `);
      passwordSpan.insertAdjacentText("beforeend", req.session.password);

      userTypeParagraph.insertAdjacentText("beforeend", `User type: `);
      userTypeSpan.insertAdjacentText("beforeend", req.session.usertype);


      let profileInfoElement = profileDOM.window.document.querySelector("#profile-info");

      profileInfoElement.insertAdjacentElement("beforeend", avatarImage);

      // profileInfoElement.insertAdjacentElement("beforeend", imageUploadForm);

      profileInfoElement.insertAdjacentElement("beforeend", usernameParagraph);
      usernameParagraph.insertAdjacentElement("beforeend", usernameSpan);

      profileInfoElement.insertAdjacentElement("beforeend", firstNameParagraph);
      firstNameParagraph.insertAdjacentElement("beforeend", firstNameSpan);

      profileInfoElement.insertAdjacentElement("beforeend", lastNameParagraph);
      lastNameParagraph.insertAdjacentElement("beforeend", lastNameSpan);

      profileInfoElement.insertAdjacentElement("beforeend", emailParagraph);
      emailParagraph.insertAdjacentElement("beforeend", emailSpan);

      profileInfoElement.insertAdjacentElement("beforeend", passwordParagraph);
      passwordParagraph.insertAdjacentElement("beforeend", passwordSpan);

      profileInfoElement.insertAdjacentElement("beforeend", userTypeParagraph);
      userTypeParagraph.insertAdjacentElement("beforeend", userTypeSpan);

      res.send(profileDOM.serialize());

    } else if (req.session.usertype === "admin") {
      let adminProfile = fs.readFileSync("./app/html/adminprofile.html", "utf-8");

      let profileDOM = new JSDOM(adminProfile);

      let avatarImage = profileDOM.window.document.createElement("img");
      avatarImage.setAttribute("src", req.session.avatarUrl);
      avatarImage.setAttribute("alt", "Avatar image");
      avatarImage.setAttribute("class", "profile-info-piece avatar-image");

      let usernameParagraph = profileDOM.window.document.createElement("p");
      usernameParagraph.setAttribute("class", "profile-info-piece");

      let usernameSpan = profileDOM.window.document.createElement("span");
      usernameSpan.setAttribute("class", "profile-info-piece username");

      let firstNameParagraph = profileDOM.window.document.createElement("p");
      firstNameParagraph.setAttribute("class", "profile-info-piece");

      let firstNameSpan = profileDOM.window.document.createElement("span");
      firstNameSpan.setAttribute("class", "profile-info-piece firstName");

      let lastNameParagraph = profileDOM.window.document.createElement("p");
      lastNameParagraph.setAttribute("class", "profile-info-piece");

      let lastNameSpan = profileDOM.window.document.createElement("span");
      lastNameSpan.setAttribute("class", "profile-info-piece lastName");

      let emailParagraph = profileDOM.window.document.createElement("p");
      emailParagraph.setAttribute("class", "profile-info-piece");

      let emailSpan = profileDOM.window.document.createElement("span");
      emailSpan.setAttribute("class", "profile-info-piece email");

      let passwordParagraph = profileDOM.window.document.createElement("p");
      passwordParagraph.setAttribute("class", "profile-info-piece");

      let passwordSpan = profileDOM.window.document.createElement("span");
      passwordSpan.setAttribute("class", "profile-info-piece password");

      let userTypeParagraph = profileDOM.window.document.createElement("p");
      userTypeParagraph.setAttribute("class", "profile-info-piece");

      let userTypeSpan = profileDOM.window.document.createElement("span");
      userTypeSpan.setAttribute("class", "profile-info-piece user-type");

      usernameParagraph.insertAdjacentText("beforeend", "");
      usernameSpan.insertAdjacentText("beforeend", req.session.username);

      firstNameParagraph.insertAdjacentText("beforeend", `First Name: `);
      firstNameSpan.insertAdjacentText("beforeend", req.session.firstName);

      lastNameParagraph.insertAdjacentText("beforeend", `Last Name: `);
      lastNameSpan.insertAdjacentText("beforeend", req.session.lastName);

      emailParagraph.insertAdjacentText("beforeend", `Email: `);
      emailSpan.insertAdjacentText("beforeend", req.session.email);

      passwordParagraph.insertAdjacentText("beforeend", `Password: `);
      passwordSpan.insertAdjacentText("beforeend", req.session.password);

      userTypeParagraph.insertAdjacentText("beforeend", `User type: `);
      userTypeSpan.insertAdjacentText("beforeend", req.session.usertype);

      let profileInfoElement = profileDOM.window.document.querySelector("#profile-info");

      profileInfoElement.insertAdjacentElement("beforeend", avatarImage);

      profileInfoElement.insertAdjacentElement("beforeend", usernameParagraph);
      usernameParagraph.insertAdjacentElement("beforeend", usernameSpan);

      profileInfoElement.insertAdjacentElement("beforeend", firstNameParagraph);
      firstNameParagraph.insertAdjacentElement("beforeend", firstNameSpan);

      profileInfoElement.insertAdjacentElement("beforeend", lastNameParagraph);
      lastNameParagraph.insertAdjacentElement("beforeend", lastNameSpan);

      profileInfoElement.insertAdjacentElement("beforeend", emailParagraph);
      emailParagraph.insertAdjacentElement("beforeend", emailSpan);

      profileInfoElement.insertAdjacentElement("beforeend", passwordParagraph);
      passwordParagraph.insertAdjacentElement("beforeend", passwordSpan);

      profileInfoElement.insertAdjacentElement("beforeend", userTypeParagraph);
      userTypeParagraph.insertAdjacentElement("beforeend", userTypeSpan);

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
    host: "us-cdbr-east-05.cleardb.net",
    user: "b836f8ec5d5bac",
    password: "732ab9c0",
    database: "heroku_024b43865916c4a",
    multipleStatements: true
  });

  //BINARY makes the password query case sensitive
  let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM BBY_03_user WHERE user_username = ? AND BINARY user_password = ? ", [username, password]);


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

    req.session.userId = retrievedUserId;
    req.session.username = retrievedUsername;
    req.session.password = retrievedPassword;
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
    host: "us-cdbr-east-05.cleardb.net",
    user: "b836f8ec5d5bac",
    password: "732ab9c0",
    database: "heroku_024b43865916c4a",
    multipleStatements: true
  });

  //Check to see if a user with selected username or email exists.
  let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM BBY_03_user WHERE user_username = ? OR user_email = ?", [signupUsername, signupEmail]);

  if (results.length === 0) {

    let userRecord = "INSERT INTO BBY_03_user (user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) values (?)";

    let recordValues = [signupUsername, signupFName, signupLName, signupEmail, signupPassword, "regular", "/img/default-avatar.svg"];

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


app.post("/deleteUsers", async (req, res) => {
  if (req.session.loggedIn && req.session.usertype === "admin") {

    let deleteID = req.body.deleteID;
    let deleteUsername = req.body.deleteUsername;
    console.log(deleteID);
    console.log(deleteUsername);

    const connection = await mysql.createConnection({
      host: "us-cdbr-east-05.cleardb.net",
      user: "b836f8ec5d5bac",
      password: "732ab9c0",
      database: "heroku_024b43865916c4a",
      multipleStatements: true
    });

    let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM BBY_03_user WHERE user_id = ? OR user_username = ?", [deleteID, deleteUsername]);

    if (results.length === 0) {
      res.send({ "status": "fail", "message": "No User with that id or username found" });
    } else {
      if (deleteUsername != req.session.username) {
        await connection.query("DELETE FROM BBY_03_user WHERE user_id = ? AND user_username = ?", [deleteID, deleteUsername]);
      } else {
        res.send({ status: "fail", message: "Can't delete your own account!" });
      }
      res.send({ status: "success", message: "Account deleted!!" });
    }
  }
})

//when the view user accounts button is clicked, this is what is loaded
app.get("/admin-dashboard", async (req, res) => {
  if (req.session.loggedIn === true && req.session.usertype === "admin") {
    let users = fs.readFileSync("./app/html/users.html", "utf-8");
    let usersDOM = new JSDOM(users);
    res.send(usersDOM.serialize());
  } else {
    res.redirect("/");
  }
});

//this is the route to get the users
app.get("/get-users", async (req, res) => {
  if (req.session.loggedIn === true && req.session.usertype === "admin") {

  const connection = await mysql.createConnection({
    host: "us-cdbr-east-05.cleardb.net",
    user: "b836f8ec5d5bac",
    password: "732ab9c0",
    database: "heroku_024b43865916c4a",
    multipleStatements: true
  });

  let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM BBY_03_user");

    res.send({ status: "success", rows: results, current_username: req.session.username});
  } else {
    res.redirect("/");
  }
})

app.post("/update-user-id", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');


  let userId = req.body.id;
  let username = req.body.username;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let usertype = req.body.usertype;
  let userAvatarUrl = req.body.userAvatarUrl;

  console.log(userId);
  console.log(username);
  console.log(firstname);
  console.log(lastname);
  console.log(email);
  console.log(password);
  console.log(username);

  const connection = await mysql.createConnection({
    host: "us-cdbr-east-05.cleardb.net",
    user: "b836f8ec5d5bac",
    password: "732ab9c0",
    database: "heroku_024b43865916c4a",
    multipleStatements: true
  });

  await connection.connect();
  let [results, fields] = await connection.query("UPDATE BBY_03_user SET user_username = ?, user_firstname = ?, user_lastname = ?, user_email = ?, user_password = ?, user_type = ?, user_avatar_url = ? WHERE user_id = ?",
    [username, firstname, lastname, email, password, usertype, userAvatarUrl, userId],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      }
    });

  //update session variables with new info from database

  // req.session.userId = userId;
  // req.session.username = username;
  // req.session.password = password;
  // req.session.firstName = firstname;
  // req.session.lastName = lastname;
  // req.session.email = email;
  // //req.session.usertype = retrievedUserType;
  // req.session.avatarUrl = userAvatarUrl;


  res.send({ status: "success", message: "Record successfully updated." });
  connection.end();
});





app.post("/update-user", async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let currentUsername = req.body.currentUsername;

  let username = req.body.username;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let userAvatarUrl = req.body.userAvatarUrl;

  console.log(`Current username: ${currentUsername}`);
  console.log(firstname);
  console.log(lastname);
  console.log(email);
  console.log(password);
  console.log(username);

  const connection = await mysql.createConnection({
    host: "us-cdbr-east-05.cleardb.net",
    user: "b836f8ec5d5bac",
    password: "732ab9c0",
    database: "heroku_024b43865916c4a",
    multipleStatements: true
  });

  await connection.connect();
  let [results, fields] = await connection.query("UPDATE BBY_03_user SET user_username = ?, user_firstname = ?, user_lastname = ?, user_email = ?, user_password = ?, user_avatar_url = ? WHERE user_username = ?",
    [username, firstname, lastname, email, password, userAvatarUrl, currentUsername],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      }
    });

  //update session variables with new info from database

  req.session.username = username;
  req.session.password = password;
  req.session.firstName = firstname;
  req.session.lastName = lastname;
  req.session.email = email;
  //req.session.usertype = retrievedUserType;
  req.session.avatarUrl = userAvatarUrl;


  res.send({ status: "success", msg: "User successfully updated." });
  connection.end();
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

var port = 8000;
app.listen(port);