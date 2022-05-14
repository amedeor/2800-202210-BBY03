"use strict;"

var currentName;
var str;

async function getUsers() {

  let response = await fetch("/get-users");

  let data = await response.json();

  currentName = data.current_username;
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
    for (let j = 0; j < editbuttons.length; j++) {
      deletebuttons[j].addEventListener("click", deleteRow);
    }

  } else {
    console.log("Error: Cannot load users.");
  }
}

function editRow(e) {

  let modalWindow = document.querySelector(".update-form-window");

  modalWindow.style.display = "block";

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
}

async function deleteRow(e) {

  let parentTd = e.target.parentNode;
  let parentTr = parentTd.parentNode;
  let user = [];

  for (let i = 0, col; col = parentTr.cells[i]; i++) {
    user[i] = col.innerText;
  }

  if (user[1] != currentName) {
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

let submitButton = document.querySelector("#submit");

submitButton.addEventListener("click", async e => {
  e.preventDefault();

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

  submitButton.addEventListener("click", uploadImage(e, username));

  //refresh the table after updating the record.
  getUsers();

  //reset the user data form
  form.reset();

  let modalWindow = document.querySelector(".update-form-window");

  modalWindow.style.display = "none";

})

getUsers();

//Function to upload a new avatar image on the user's profile page
async function uploadImage(e, username) {
  e.preventDefault();

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
  getUsers();

}

getUsers();

let modalWindow = document.querySelector(".update-form-window");
let cancelButton = document.querySelector("#cancel-button");

cancelButton.addEventListener("click", e => {
  e.preventDefault();
  modalWindow.style.display = "none";
})


let createUserModalWindow = document.querySelector(".create-form-window");
let creatUserButton = document.querySelector("#create-user-button");
let submitUserCreationButton = document.querySelector("#submit-new-user");
let cancelUserCreationButton = document.querySelector("#cancel-user-creation");
let createUserAvatar = document.querySelector("#create-image-upload");

// Shows the user creation modal when the "Create User" buton is clicked.
creatUserButton.addEventListener("click", e => {
  e.preventDefault();
  clearInputFile(createUserAvatar);
  createUserModalWindow.style.display = "block";
})

// Hides the user creation modal when the "Submit" button is clicked.
submitUserCreationButton.addEventListener("click", async e => {
  e.preventDefault();

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

  submitUserCreationButton.addEventListener("click", uploadCreateImage(e, createUsername));

  //refresh the table after updating the record.
  getUsers();

  //reset the user data form
  createForm.reset();

  let createUserModalWindow = document.querySelector(".create-form-window");

  createUserModalWindow.style.display = "none";

})


// Hides the user creation modal when the "Cancel" button is clicked.
cancelUserCreationButton.addEventListener("click", e => {
  e.preventDefault();
  clearInputFile(createUserAvatar);
  createUserModalWindow.style.display = "none";
})

// Removes the file form the input once the "Submit" button or "Cancel" button is clicked.
function clearInputFile(f) {
  if (f.value) {
    try {
      f.value = '';
    } catch (error) {
      console.log(error);
    }
  }
}

//Function to upload a new avatar image on the user's profile page
async function uploadCreateImage(e, username) {
  e.preventDefault();

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

// Clears the input fields for user creation and edit.
function clearInputs(formInputFields) {
  for (var j in formInputFields) {
    try {
      formInputFields[j].value = "";
    } catch (error) {
      console.log(error);
    }
  }
}