"use strict";

async function editProfileInfo() {
  // let editSubmitButton = document.querySelector("#save-changes-button");

  // if (editSubmitButton != null) {
  //   editSubmitButton.addEventListener("click", async e => {
  //     e.preventDefault(); 
  
      let currentUsername = document.querySelector(".username").innerText;
  
      //get the URL of the user's current profile picture
      let userAvatarElement = document.querySelector(".avatar-image");
      let userAvatarUrl = userAvatarElement.getAttribute("src");
  
      let firstName = document.querySelector("#firstname").value;
      let lastName = document.querySelector("#lastname").value;
      let email = document.querySelector("#email").value;
      let password = document.querySelector("#password").value;
      let username = document.querySelector("#username").value;
  
      let response = await fetch("/update-user", {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `currentUsername=${currentUsername}&username=${username}&password=${password}&firstname=${firstName}&lastname=${lastName}&email=${email}&userAvatarUrl=${userAvatarUrl}`
      });
  
      let parsedResponse = await response.json();
  
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
  
    // });
  // }
}

// //Get the upload image form element
// const uploadImageForm = document.getElementById("upload-images-form");

// //Attach an event listener to the upload image form's submit eventhandler
// //The uploadImage function will fire when the uploadImageForm's submit event is triggered
// uploadImageForm.addEventListener("submit", uploadImage);


//Function to upload a new avatar image on the user's profile page
async function uploadImage(e) {
  // e.preventDefault();

  const imageUpload = document.querySelector('#image-upload');

  if (imageUpload.checkValidity() !== false) {
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
  
    //clear the HTML file input after the image has been uploaded
    //required attribute must be set on HTML file input to prevent empty photos from being uploaded
    imageUpload.value = "";
  } else {
    //
  }
}


let editProfileButton = document.querySelector("#edit-profile-button");

//When the Edit Information button is clicked, open the form and populate it with the user's current info
editProfileButton.addEventListener("click", e => {
   
  //Get the user's current information 
  let firstName = document.querySelector(".firstName").innerText;
  let lastName = document.querySelector(".lastName").innerText;
  let username = document.querySelector(".username").innerText;
  let email = document.querySelector(".email").innerText;
  let password = document.querySelector(".password").innerText;

  //Get the edit-user-info-form input elements and populate them with the user's current info
  document.querySelector("#firstname").value = firstName;
  document.querySelector("#lastname").value = lastName;
  document.querySelector("#email").value = email;
  document.querySelector("#password").value = password;
  document.querySelector("#username").value = username;
  $("#edit-user-info-form").dialog("open");
})

$("#edit-user-info-form").dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  resizable: false,
  autoOpen: false,
  draggable: false,
  title: "Edit Profile Info",
  Width: 50,
  height: 450,
  buttons: [
    {
      text: "Submit",
      click: function() {
        editProfileInfo()
      $(this).dialog("close");
      }
    },
    {
      text: "Cancel", 
      click: function(){
        //select this dialog and close it when cancel is pressed
        $(this).dialog("close");
      }
    }
  ]
});

//This block of code to center the jQuery UI modal popup when the window is resized is from
//https://stackoverflow.com/questions/3060146/how-to-auto-center-jquery-ui-dialog-when-resizing-browser
//with adaptatations made to apply to my modal window
$(window).resize(function(){
  $("#edit-user-info-form").dialog( "option", "position", { my: "center", at: "center", of: window } );
});



let changeAvatarButton = document.querySelector("#change-avatar-button");

changeAvatarButton.addEventListener("click", e => {
  $("#upload-images-form").dialog("open");
});

$("#upload-images-form").dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  resizable: false,
  autoOpen: false,
  draggable: false,
  title: "Change Avatar",
  Width: 300,
  height: 200,
  buttons: [
    {
      text: "Submit",
      click: function() {
        uploadImage();
        $(this).dialog("close");
      }
    },
    {
      text: "Cancel", 
      click: function(){
        //select this dialog and close it when cancel is pressed
        $(this).dialog("close");
      }
    }
  ]
});

//This block of code to center the jQuery UI modal popup when the window is resized is from
//https://stackoverflow.com/questions/3060146/how-to-auto-center-jquery-ui-dialog-when-resizing-browser
//with adaptatations made to apply to my modal window
$(window).resize(function(){
  $("#upload-images-form").dialog( "option", "position", { my: "center", at: "center", of: window } );
});


async function getDeals() {

  let response = await fetch("/get-deals");

  let parsedResponse = await response.json();

  console.log(parsedResponse);

  let dealsContainer = document.querySelector("#deals");

  dealsContainer.innerText = "";

  for (let deal of parsedResponse.usersDeals) {

    let dealContainer = document.createElement("div");

    //set the id of the deal container to the id of the specific deal
    dealContainer.setAttribute("id", deal.deal_id);
    dealContainer.setAttribute("class", "deal-container");

    let dealIdParagraph = document.createElement("p");
    let userIdParagraph = document.createElement("p");
    let dealNameParagraph = document.createElement("p");
    let dealPriceParagraph = document.createElement("p");
    let dealPostDateParagraph = document.createElement("p");
    let dealExpiryDateParagraph = document.createElement("p");
    let dealDescriptionParagraph = document.createElement("p");
    let dealStoreLocationParagraph = document.createElement("p");
    
    dealIdParagraph.insertAdjacentText("beforeend", `Deal ID: ${deal.deal_id}`);
    userIdParagraph.insertAdjacentText("beforeend", `User ID: ${deal.user_id}`);
    dealNameParagraph.insertAdjacentText("beforeend", `Deal Name: ${deal.deal_name}`);
    dealPriceParagraph.insertAdjacentText("beforeend", `Price: ${deal.deal_price}`);
    dealPostDateParagraph.insertAdjacentText("beforeend", `Post Date: ${deal.deal_post_date}`);
    dealExpiryDateParagraph.insertAdjacentText("beforeend", `Deal Expiry Date: ${deal.deal_expiry_date}`);
    dealDescriptionParagraph.insertAdjacentText("beforeend", `Description: ${deal.deal_description}`);
    dealStoreLocationParagraph.insertAdjacentText("beforeend", `Store Location: ${deal.deal_store_location}`);

    dealContainer.insertAdjacentElement("beforeend", dealIdParagraph);
    dealContainer.insertAdjacentElement("beforeend", userIdParagraph);
    dealContainer.insertAdjacentElement("beforeend", dealNameParagraph);
    dealContainer.insertAdjacentElement("beforeend", dealPriceParagraph);
    dealContainer.insertAdjacentElement("beforeend", dealPostDateParagraph);
    dealContainer.insertAdjacentElement("beforeend", dealExpiryDateParagraph);
    dealContainer.insertAdjacentElement("beforeend", dealDescriptionParagraph);
    dealContainer.insertAdjacentElement("beforeend", dealStoreLocationParagraph);

    console.log(deal.deal_id);
    console.log(deal.user_id);
    console.log(deal.deal_price);
    console.log(deal.deal_description);
    console.log(deal.deal_store_location);
    
    for (let photo of deal.photos) {
      let photoElement = document.createElement("img");
      photoElement.setAttribute("src", photo.photo_url);
      photoElement.setAttribute("class", photo.photo_id);
      dealContainer.insertAdjacentElement("beforeend", photoElement);
      console.log(photo.photo_id);
      console.log(photo.photo_url);
    }

    dealsContainer.insertAdjacentElement("beforeend", dealContainer);
  }
}

getDeals();