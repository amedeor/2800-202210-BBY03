"use strict";

var currentID;
var str;

// Retrieves all the users and their information and populates it onto the page as a table
async function getUsers() {

  let response = await fetch("/get-users");

  let data = await response.json();

  currentID = data.current_id;
  if (data.status == "success") {

    let str = `<tr><th class="id_header"><span>ID</span></th><th class="username_header"><span>Username</span></th><th class="firstname_header"><span>First Name</span></th><th class="lastname_header"><span>Last Name</span></th><th class="email_header"><span>Email</span></th><th class="password_header"><span>Password</span></th><th class="usertype_header"><span>User Type</span></th><th class="avatarimage_header"><span>Avatar</span></th></tr>`;

    for (let i = 0; i < data.rows.length; i++) {
      let row = data.rows[i];
      str += `<tr><td class='id'>${row.user_id}</td><td class='username'>${row.user_username}</td><td class='firstname'>${row.user_firstname}</td><td class='lastname'>${row.user_lastname}</td><td class='email'>${row.user_email}</td><td class='password'>${row.user_password}</td><td class='usertype'>${row.user_type}</td><td id="user${row.user_id}avatarURL" class='useravatarurl'>${row.user_avatar_url}</td><td ><button class='editButton'>Edit</button></sp</td><td><button class='deleteButton'>Delete</button></td></tr>`
    }

    //insert the str that contains the code to populate the table into the table element with id="users"
    document.getElementById("users").innerHTML = str;

    // select all spans that have a class="editButton"
    let editbuttons = document.querySelectorAll(".editButton");
    for (let j = 0; j < editbuttons.length; j++) {
      editbuttons[j].addEventListener("click", editRow);
    }

    let deletebuttons = document.querySelectorAll(".deleteButton");
    for (let j = 0; j < deletebuttons.length; j++) {
      let currentParentTd = deletebuttons[j].parentNode;
      let currentParentTr = currentParentTd.parentNode;
      let users = [];

      //Goes through all the rows, adds them to the users array, checks to see if the user's username matches the current user, 
      //and if it does it will remove the deleteButton class from the delete button and disable it.
      for (let i = 0, col; col = currentParentTr.cells[i]; i++) {
        users[i] = col.innerText;
      }
      if (users[0] != currentID) {
        deletebuttons[j].addEventListener("click", function (e) {
          $("#confirm-user-account-delete").dialog({
            title: "Confirm user account delete",
            resizable: false,
            draggable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
              "Delete user acccount": async function () {
                deleteRow(e);
                $(this).dialog("close");
              },
              Cancel: function () {
                $(this).dialog("close");
              }
            }
          });
        });
      } else {
        deletebuttons[j].classList.remove('deleteButton');
        deletebuttons[j].disabled = true;
      }
    }
  } else {
    console.log("Error: Cannot load users.");
  }
}

// Opens a popup form of the user being edited
function editRow(e) {

  let parentTd = e.target.parentNode;
  let parentTr = parentTd.parentNode;
  let user = [];
  let userAvatarUrl;

  for (let i = 0, col; col = parentTr.cells[i]; i++) {
    user[i] = col.innerText;
  }

  document.querySelector("#id").value = user[0];
  document.querySelector("#username").value = user[1];
  document.querySelector("#firstname").value = user[2];
  document.querySelector("#lastname").value = user[3];
  document.querySelector("#email").value = user[4];
  document.querySelector("#password").value = user[5];
  document.querySelector("#usertype").value = user[6];

  userAvatarUrl = user[7];

  // if (user[0] == currentID) {
  //   document.querySelector(".username").innerText = userRecord.user_username;
  //   document.querySelector(".firstName").innerText = userRecord.user_firstname;
  //   document.querySelector(".lastName").innerText = userRecord.user_lastname;
  //   document.querySelector(".email").innerText = userRecord.user_email;
  //   document.querySelector(".password").innerText = userRecord.user_password;
  // }
  //open the jQuery modal window when the edit button is clicked
  $("#update-record-form-container").dialog("open");
}

// Deletes the user from the table and in the database
async function deleteRow(e) {

  let parentTd = e.target.parentNode;
  let parentTr = parentTd.parentNode;
  let user = [];

  for (let i = 0, col; col = parentTr.cells[i]; i++) {
    user[i] = col.innerText;
  }

  if (user[0] != currentID) {
    parentTr.remove();
    let response = await fetch("/deleteUsers", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `deleteID=${user[0]}&deleteUsername=${user[1]}`
    });

    let parsedResponse = await response.json();
    parsedResponse;
  }
}

// Opens a popup form to allow the admin to edit the user's information
async function updateUser() {
  let userAvatarUrl;

  let form = document.querySelector("#update-record-form");
  let fileUploadInput = document.querySelector("#image-upload");

  let id = document.querySelector("#id").value;
  let oldAvatarURL = document.querySelector(`#user${id}avatarURL`).innerText;

  let username = document.querySelector("#username").value;
  let firstname = document.querySelector("#firstname").value;
  let lastname = document.querySelector("#lastname").value;
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  let usertype = document.querySelector("#usertype").value;

  if (fileUploadInput.value != "") {
    userAvatarUrl = document.querySelector("#image-upload").value;
  } else {
    userAvatarUrl = oldAvatarURL;
  }

  let response = await fetch("/update-user-id", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `id=${id}&username=${username}&password=${password}&firstname=${firstname}&lastname=${lastname}&email=${email}&usertype=${usertype}&userAvatarUrl=${userAvatarUrl}`
  });

  let parsedResponse = await response.json();

  if (parsedResponse.status === "success") {
    document.querySelector("#status").innerHTML = "";
    document.querySelector("#status").insertAdjacentText("afterbegin", parsedResponse.message);
  } else {
    console.log(parsedResponse.status);
  }

  uploadImage(username);

  //refresh the table after updating the record.
  getUsers();

  //reset the user data form
  form.reset();
}

//Function to upload a new avatar image on the user's profile page
async function uploadImage(username) {

  const imageUpload = document.querySelector('#image-upload');
  const formData = new FormData();

  //Use a loop to get the image from the image upload input and store it in a variable called file
  for (let i = 0; i < imageUpload.files.length; i++) {
    formData.append("file", imageUpload.files[i]);
  }

  //append the passed in user's username to the formData that will be sent to the server
  //this allows us to update the avatar URL for the correct user in the database
  formData.append("username", username);

  const options = {
    method: 'POST',
    body: formData,
  };

  await fetch("/upload-image", options
  ).then(function (res) {

  }).catch(function (error) { ("Error:", error) }
  );

  let updatedRecordResponse = await fetch("/get-user");

  let parsedUpdatedRecordResponse = await updatedRecordResponse.json();

  imageUpload.value = ""; //MAY NEED TO REMOVE THIS

  getUsers();

}

// Opens a popup form for the admin user to fill-in to create a new user
async function createUser() {

  let createUserAvatarUrl;

  let createForm = document.querySelector("#create-record-form");
  let createFileUploadInput = document.querySelector("#create-image-upload");

  let id = document.querySelector("#id").value;

  let createUsername = document.querySelector("#create-username").value;
  let createFirstname = document.querySelector("#create-firstname").value;
  let createLastname = document.querySelector("#create-lastname").value;
  let createEmail = document.querySelector("#create-email").value;
  let createPassword = document.querySelector("#create-password").value;
  let createUsertype = document.querySelector("#create-usertype").value;

  if (createFileUploadInput.value != "") {
    createUserAvatarUrl = document.querySelector("#create-image-upload").value;
  } else {
    createUserAvatarUrl = "/img/default-avatar.svg";
  }

  let response = await fetch("/admin-create-user", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `createUsername=${createUsername}&createPassword=${createPassword}&createFirstname=${createFirstname}&createLastname=${createLastname}&createEmail=${createEmail}&createUsertype=${createUsertype}&createUserAvatarUrl=${createUserAvatarUrl}`
  });

  let parsedResponse = await response.json();

  if (parsedResponse.status === "success") {
    document.querySelector("#status").innerHTML = "";
    document.querySelector("#status").insertAdjacentText("afterbegin", parsedResponse.message);
  } else {
    console.log(parsedResponse.status);
  }


  uploadCreateImage(createUsername);

  //refresh the table after updating the record.
  getUsers();

  // //reset the user data form
  createForm.reset();

}

//Function to upload a new avatar image on the user's profile page

//async function uploadCreateImage(e, username)
async function uploadCreateImage(username) {

  const imageUpload = document.querySelector('#create-image-upload');
  const formData = new FormData();

  //Use a loop to get the image from the image upload input and store it in a variable called file
  for (let i = 0; i < imageUpload.files.length; i++) {
    formData.append("file", imageUpload.files[i]);
  }

  //append the passed in user's username to the formData that will be sent to the server
  //this allows us to update the avatar URL for the correct user in the database
  formData.append("username", username);

  const options = {
    method: 'POST',
    body: formData,
  };

  await fetch("/upload-image", options
  ).then(function (res) {

  }).catch(function (err) { ("Error:", err) }
  );

  let updatedRecordResponse = await fetch("/get-user");

  let parsedUpdatedRecordResponse = await updatedRecordResponse.json();
  getUsers();

}

// Modal popup form for editing a user's information
$("#update-record-form-container").dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  resizable: false,
  autoOpen: false,
  draggable: false,
  title: "Edit User Info",
  Width: 50,
  height: 500,
  buttons: [
    {
      text: "Submit",
      click: function () {
        updateUser();
        clearStatusMessage();
        $(this).dialog("close");
      }
    },
    {
      text: "Cancel",
      click: function () {
        //select this dialog and close it when cancel is pressed
        $(this).dialog("close");
      }
    }
  ]
});

//This block of code to center the jQuery UI modal popup when the window is resized is from
//https://stackoverflow.com/questions/3060146/how-to-auto-center-jquery-ui-dialog-when-resizing-browser
//with adaptatations made to apply to my modal window
$(window).resize(function () {
  $("#update-record-form-container").dialog("option", "position", { my: "center", at: "center", of: window });
});

let createUserButton = document.querySelector("#create-user-button");

createUserButton.addEventListener("click", e => {
  $("#create-record-form-container").dialog("open");
});

// Clears the status message after some time has passed
function clearStatusMessage() {
  let statusMessage = document.querySelector("#status");
  setTimeout(() => {
    statusMessage.innerText = "";
  }, 3000)
}

// Modal popup form for creating a new user
$("#create-record-form-container").dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  resizable: false,
  autoOpen: false,
  draggable: false,
  title: "Create New User",
  Width: 50,
  height: 500,
  buttons: [
    {
      text: "Submit",
      click: function () {
        createUser();
        uploadCreateImage(username); //username is a global variable
        clearStatusMessage();
        $(this).dialog("close");
      }
    },
    {
      text: "Cancel",
      click: function () {
        //select this dialog and close it when cancel is pressed
        $(this).dialog("close");
      }
    }
  ]
});

//This block of code to center the jQuery UI modal popup when the window is resized is from
//https://stackoverflow.com/questions/3060146/how-to-auto-center-jquery-ui-dialog-when-resizing-browser
//with adaptatations made to apply to my modal window
$(window).resize(function () {
  $("#create-record-form-container").dialog("option", "position", { my: "center", at: "center", of: window });
});

getUsers();