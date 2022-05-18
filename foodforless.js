"use strict";

// const databaseHost = "us-cdbr-east-05.cleardb.net";
// const databaseUser = "b836f8ec5d5bac";
// const databasePassword = "732ab9c0";
// const databaseName = "heroku_024b43865916c4a";

const databaseHost = "127.0.0.1";
const databaseUser = "root";
const databasePassword = "";
const databaseName = "COMP2800";

const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const { JSDOM } = require("jsdom");
const mysql = require("mysql2/promise");

const multer = require("multer");
const res = require("express/lib/response");

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
app.use("/html", express.static("./app/html"));

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
    host: databaseHost,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
    multipleStatements: true
  });

  let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM BBY_03_user WHERE user_username = ?", [username], function (error, results, fields) {
    if (error) {
      console.log(error);
    }
  });

  res.send({ status: "success", rows: results });
  connection.end();
});



app.get("/get-deals", async (req, res) => {

  res.setHeader("Content-Type", "application/json");

  const connection = await mysql.createConnection({
    host: databaseHost,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
    multipleStatements: true
  });

  let currentUserId = req.session.userId;

//   console.log(`Current user id: ${currentUserId}`);

//   let [dealResults, dealFields] = await connection.query("SELECT deal_id, user_id, deal_name, deal_price, deal_description, deal_store_location, deal_post_date, deal_expiry_date FROM BBY_03_deal WHERE user_id = (?)", [currentUserId]);

//   console.log(dealResults);

//   //deals holds all of the parsed deal and photo information
//   //each object stored in deals contains all of a user's deal information with an array called "photos" that holds the URLs to the images associated with the deal
//   let deals = [];

//   for (let deal of dealResults) {
//     //get all the photo URLs associated with a specific deal_id
//     let [results, fields] = await connection.query("SELECT photo_url FROM BBY_03_photo WHERE fk_photo_deal_id = ?", [deal.deal_id])
//     //create an array that will hold the URLs of the specific deal's photos
//     let photoUrls = [];
//     for (let result of results){
//       //loop through the results of the database query on the photos table retrieve just the URLs and then save them to photoUrls
//       photoUrls.push(result.photo_url)
//     }
//     //Create an object that contains all of a user's specific deal information with an array of the photos associated with that deal
//     deals.push({"deal_id": deal.deal_id, "user_id": deal.user_id, "deal_price": deal.deal_price, "deal_description": deal.deal_description, "deal_store_location": deal.deal_store_location, "deal_post_date": deal.deal_post_date, "deal_expiry_date": deal.deal_expiry_date, "photos": photoUrls });
//   }

//   console.log(deals);

//   res.send({"usersDeals": deals});
// });







let [dealResults, dealFields] = await connection.query("SELECT deal_id, user_id, deal_name, deal_price, deal_description, deal_store_location, deal_post_date, deal_expiry_date FROM BBY_03_deal WHERE user_id = (?)", [currentUserId]);

console.log(dealResults);

//deals holds all of the parsed deal and photo information
//each object stored in deals contains all of a user's deal information with an array called "photos" that holds the URLs to the images associated with the deal
let deals = [];

for (let deal of dealResults) {
  //get all the photo URLs associated with a specific deal_id
  let [results, fields] = await connection.query("SELECT photo_url, photo_id FROM BBY_03_photo WHERE fk_photo_deal_id = ?", [deal.deal_id])
  //create an array that will hold the URLs of the specific deal's photos
  let photoUrls = [];
  for (let result of results){
    //loop through the results of the database query on the photos table retrieve just the URLs and then save them to photoUrls
    photoUrls.push({"photo_id": result.photo_id, "photo_url": result.photo_url});
  }
  //Create an object that contains all of a user's specific deal information with an array of the photos associated with that deal
  deals.push({"deal_id": deal.deal_id, "user_id": deal.user_id, "deal_name": deal.deal_name, "deal_price": deal.deal_price, "deal_description": deal.deal_description, "deal_store_location": deal.deal_store_location, "deal_post_date": deal.deal_post_date, "deal_expiry_date": deal.deal_expiry_date, "photos": photoUrls });
}

console.log(deals);

res.send({"usersDeals": deals});
});










//the argument to upload.array is the name of the variable in formData
app.post("/post-deal", upload.array("files"), async (req, res) => {

  if (req.session.loggedIn === true) {
    res.setHeader("Content-Type", "application/json");

    let photos = [];

    console.log(`req.files: ${req.files}`);

    //if req.files is undefined, it means no photos were uploaded when the deal form was submitted
    if (req.files != undefined) {
      console.log(`Number of files uploaded: ${req.files.length}`);
      for (let i = 0; i < req.files.length; i++) {
        console.log("inside for loop");
        //add photos to array
        photos.push(`/img/${req.files[i].filename}`);
      }
    }

    //get the currently logged in user's user ID
    let currentUserId = req.session.userId;

    console.log(`Current user ID: ${currentUserId}`);

    console.log(req.body.dealExpiryDate);

    let dealName = req.body.dealName;
    let dealPrice = req.body.dealPrice;
    let dealDescription = req.body.dealDescription;
    let dealLocation = req.body.dealLocation;
    let dealExpiryDate = req.body.dealExpiryDate;

    console.log(`Deal name: ${dealName}`);
    console.log(`Deal price: ${dealPrice}`);
    console.log(`Deal description: ${dealDescription}`);
    console.log(`Deal location: ${dealLocation}`);
    console.log(`Deal expiry date: ${dealExpiryDate}`);

    const connection = await mysql.createConnection({
      host: databaseHost,
      user: databaseUser,
      password: databasePassword,
      database: databaseName,
      multipleStatements: true
    });

    let dealRecord = "INSERT INTO BBY_03_deal (deal_name, deal_price, deal_description, deal_store_location, deal_expiry_date, user_id) values (?)";
    let dealRecordValues = [dealName, dealPrice, dealDescription, dealLocation, dealExpiryDate, currentUserId];
    await connection.query(dealRecord, [dealRecordValues]);

    //Get the deal_id of the last inserted deal into BBY_03_deal
    let lastInsertIdObject = await connection.query("SELECT LAST_INSERT_ID()");
    let lastInsertIdArray = lastInsertIdObject[0];
    let insertObject = lastInsertIdArray[0];
    let lastInsertedId = insertObject["LAST_INSERT_ID()"]; //This is the deal_id of the deal that was just inserted into the database

    console.log(`lastInsertedId: ${lastInsertedId}`);

    if (req.files != undefined) {
      console.log("Going to insert photo record into bby_03_photo");
      for (let photo of photos) {
        let photoRecord = "INSERT INTO BBY_03_photo (fk_photo_deal_id, photo_url) values (?)";
        let photoRecordValues = [lastInsertedId, photo];
        await connection.query(photoRecord, [photoRecordValues]);
      }
    }
    res.send({ "status": "success", "message": "Post created successfully." });
  }
});

//the argument to single is the name of the HTML input element that is uploading the file
app.post("/upload-image", upload.single("file"), async (req, res) => {

  if (req.file != undefined) {
    let savedFileName = `/img/${req.file.filename}`;
    let username = req.body.username;
    const connection = await mysql.createConnection({
      host: databaseHost,
      user: databaseUser,
      password: databasePassword,
      database: databaseName,
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
});

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
    host: databaseHost,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
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
    host: databaseHost,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
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


app.post("/admin-create-user", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let createFirstname = req.body.createFirstname;
  let createLastname = req.body.createLastname;
  let createEmail = req.body.createEmail;
  let createUsername = req.body.createUsername;
  let createPassword = req.body.createPassword;
  let createUsertype = req.body.createUsertype;
  let createUserAvatarUrl = req.body.createUserAvatarUrl;

  const connection = await mysql.createConnection({
    host: databaseHost,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
    multipleStatements: true
  });

  //Check to see if a user with selected username or email exists.
  let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM BBY_03_user WHERE user_username = ? OR user_email = ?", [createUsername, createEmail]);

  if (results.length === 0) {

    let userRecord = "INSERT INTO BBY_03_user (user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url) values (?)";

    let recordValues = [createUsername, createFirstname, createLastname, createEmail, createPassword, createUsertype, createUserAvatarUrl];

    await connection.query(userRecord, [recordValues]);

    res.send({ "status": "success", "message": "User created!" });
  } else {
    res.send({ "status": "fail", "message": "Email or Username is already in use" });
  }
});


app.post("/deleteUsers", async (req, res) => {
  if (req.session.loggedIn && req.session.usertype === "admin") {

    let deleteID = req.body.deleteID;
    let deleteUsername = req.body.deleteUsername;

    const connection = await mysql.createConnection({
      host: databaseHost,
      user: databaseUser,
      password: databasePassword,
      database: databaseName,
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
});

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
      host: databaseHost,
      user: databaseUser,
      password: databasePassword,
      database: databaseName,
      multipleStatements: true
    });
    let [results, fields] = await connection.query("SELECT user_id, user_username, user_firstname, user_lastname, user_email, user_password, user_type, user_avatar_url FROM BBY_03_user");
    res.send({ status: "success", rows: results, current_username: req.session.username });
  } else {
    res.redirect("/");
  }
});

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

  const connection = await mysql.createConnection({
    host: databaseHost,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
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

  const connection = await mysql.createConnection({
    host: databaseHost,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
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

const port = 8000;
app.listen(port);