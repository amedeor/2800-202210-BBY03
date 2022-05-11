"use strict;"

let editSubmitButton = document.querySelector("#save-changes-button");

if (editSubmitButton != null) {
  editSubmitButton.addEventListener("click", async e => {
    e.preventDefault(); //Removed this because the page needs to refresh to show the new information

    console.log("Save Changes button clicked");

    let currentUsername = document.querySelector(".username").innerText;

    //get the URL of the user's current profile picture
    let userAvatarElement = document.querySelector(".avatar-image");
    let userAvatarUrl = userAvatarElement.getAttribute("src");

    let firstName = document.querySelector("#firstname").value;
    let lastName = document.querySelector("#lastname").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let username = document.querySelector("#username").value;

    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(password);
    console.log(username);


    let response = await fetch("/update-user", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `currentUsername=${currentUsername}&username=${username}&password=${password}&firstname=${firstName}&lastname=${lastName}&email=${email}&userAvatarUrl=${userAvatarUrl}`
    });

    let parsedResponse = await response.json();

    console.log(parsedResponse);

    if (parsedResponse.status === "fail") {
      document.querySelector("#error-message").innerHTML = "";
      document.querySelector("#error-message").insertAdjacentText("afterbegin", parsedResponse.message);
    }


    let updatedRecordResponse = await fetch("/get-user");


    let parsedUpdatedRecordResponse = await updatedRecordResponse.json();



    // get the parsed json from the /get-user route and store it in a variable
    // if the /get-user request was successful, the response will contain the user's row from the database
    let userRecord = parsedUpdatedRecordResponse.rows[0];

    //Update the HTML on the profile page to reflect the new changes made to the user's profile data in the database

    userAvatarElement.setAttribute("src", userRecord.user_avatar_url);
    document.querySelector(".username").innerText = userRecord.user_username;
    document.querySelector(".firstName").innerText = userRecord.user_firstname;
    document.querySelector(".lastName").innerText = userRecord.user_lastname;
    document.querySelector(".email").innerText = userRecord.user_email;
    document.querySelector(".password").innerText = userRecord.user_password;

    //hide the form after the Save Changes button is pressed
    modal.style.display = "none";



  })
}



//Code for edit window
// Get the modal
let modal = document.querySelector("#editWindow");

// Get the button that opens the modal
let btn = document.querySelector("#edit-profile-button");

// Get the close button to close the modal
let span = document.getElementsByClassName("cancel")[0];


// When the user clicks the button, open the modal 
btn.addEventListener("click", e => {
  modal.style.display = "block";

  //Get the user's first name from the span element
  let firstName = document.querySelector(".firstName").innerText;
  console.log(firstName);

  let lastName = document.querySelector(".lastName").innerText;
  let username = document.querySelector(".username").innerText;
  let email = document.querySelector(".email").innerText;
  let password = document.querySelector(".password").innerText;

  //get the firstname input element from the pop-up form and set it's value to the user's first name
  document.querySelector("#firstname").value = firstName;
  document.querySelector("#lastname").value = lastName;
  document.querySelector("#email").value = email;
  document.querySelector("#password").value = password;
  document.querySelector("#username").value = username;

})

// When the user uses button "cancel"
span.addEventListener("click", e => {
  e.preventDefault();
  modal.style.display = "none";
})



//Code for edit window
// Get the modal
let changeAvatarModalWindow = document.querySelector("#changeAvatarWindow");

// Get the button that opens the modal
let changeAvatarButton = document.querySelector("#change-avatar-button");

// Get the close button to close the modal
let cancelAvatarUploadButton = document.querySelector("#cancel-avatar-upload");

changeAvatarButton.addEventListener("click", e => {
  changeAvatarModalWindow.style.display = "block";
});

cancelAvatarUploadButton.addEventListener("click", e => {
  changeAvatarModalWindow.style.display = "none";
});




//Get the upload image form element
const uploadImageForm = document.getElementById("upload-images-form");

//Attach an event listener to the upload image form's submit eventhandler
//The uploadImage function will fire when the uploadImageForm's submit event is triggered
uploadImageForm.addEventListener("submit", uploadImage);


//Function to upload a new avatar image on the user's profile page
async function uploadImage(e) {
  e.preventDefault();

  const imageUpload = document.querySelector('#image-upload');
  const formData = new FormData();

  //Use a loop to get the image from the image upload input and store it in a variable called file
  for (let i = 0; i < imageUpload.files.length; i++) {
    formData.append("file", imageUpload.files[i]);
  }

  //append the user's username to the formData that will be sent to the server
  //this allows us to update the avatar URL for the correct user in the database
  formData.append("username", document.querySelector(".username").innerText);

  const options = {
    method: 'POST',
    body: formData,
  };

  await fetch("/upload-image", options
  ).then(function (res) {
    console.log(res);
  }).catch(function (err) { ("Error:", err) }
  );

  let updatedRecordResponse = await fetch("/get-user");

  let parsedUpdatedRecordResponse = await updatedRecordResponse.json();

  // get the parsed json from the /get-user route and store it in a variable
  // if the /get-user request was successful, the response will contain the user's row from the database
  let userRecord = parsedUpdatedRecordResponse.rows[0];

  //Update the HTML on the profile page to reflect the new changes made to the user's profile data in the database
  let userAvatarElement = document.querySelector(".avatar-image");
  let userAvatarUrl = userAvatarElement.getAttribute("src");
  userAvatarElement.setAttribute("src", userRecord.user_avatar_url);

  //hide the form after the Save Changes button is pressed
  modal.style.display = "none";

}