"use strict";

getDeals();

async function editProfileInfo() {
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
}

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
      click: function () {
        editProfileInfo()
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
  $("#edit-user-info-form").dialog("option", "position", { my: "center", at: "center", of: window });
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
      click: function () {
        uploadImage();
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
  $("#upload-images-form").dialog("option", "position", { my: "center", at: "center", of: window });
});


var easter_count = 0;
function easter_egg() {
  easter_count++;
  if (easter_count >= 3) {
    document.getElementById("easter_egg").innerHTML = "FoodForLe$$";
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/easter_egg.css";
    document.getElementsByTagName('HEAD')[0].appendChild(link);
  }
}

async function getDeals() {

  let response = await fetch("/get-deals");

  let parsedResponse = await response.json();

  // console.log(parsedResponse);

  let dealsContainer = document.querySelector("#deals");

  dealsContainer.innerHTML = "";

  for (let deal of parsedResponse.usersDeals) {

    let dealContainer = document.createElement("div");

    //set the id of the deal container to the id of the specific deal
    dealContainer.setAttribute("id", deal.deal_id);
    dealContainer.setAttribute("class", "deal-container");

    let dealIdParagraph = document.createElement("p");
    dealIdParagraph.setAttribute("id", "dealidparagraph");
    let dealIdSpan = document.createElement("span");

    let userIdParagraph = document.createElement("p");
    userIdParagraph.setAttribute("id", "useridparagraph");
    let userIdSpan = document.createElement("span");


    let dealNameParagraph = document.createElement("p");
    dealNameParagraph.setAttribute("id", "dealnameparagraph");
    let dealNameSpan = document.createElement("span");


    let dealPriceParagraph = document.createElement("p");
    dealPriceParagraph.setAttribute("id", "dealpriceparagraph");
    let dealPriceSpan = document.createElement("span");


    let dealPostDateParagraph = document.createElement("p");
    dealPostDateParagraph.setAttribute("id", "dealpostdateparagraph");
    let dealPostSpan = document.createElement("span");


    let dealExpiryDateParagraph = document.createElement("p");
    dealExpiryDateParagraph.setAttribute("id", "dealexpirydateparagraph");
    let dealExpiryDateSpan = document.createElement("span");


    let dealDescriptionParagraph = document.createElement("p");
    dealDescriptionParagraph.setAttribute("id", "dealdescriptionparagraph");
    let dealDescriptionSpan = document.createElement("span");


    let dealStoreLocationParagraph = document.createElement("p");
    dealStoreLocationParagraph.setAttribute("id", "dealstorelocationparagraph");
    let dealStoreLocationSpan = document.createElement("span");


    let editDealButton = document.createElement("input");
    editDealButton.setAttribute("class", "edit-deal-button");
    editDealButton.setAttribute("type", "submit");
    editDealButton.setAttribute("value", "Edit deal");

    let deleteDealButton = document.createElement("input");
    deleteDealButton.setAttribute("class", "delete-deal-button");
    deleteDealButton.setAttribute("type", "submit");
    deleteDealButton.setAttribute("value", "Delete deal");


    //This block of code to calculate the local time using the built in JavaScript getTimezoneOffset() function is from 
    //https://stackoverflow.com/questions/7403486/add-or-subtract-timezone-difference-to-javascript-date
    //with adaptatations made to display the local date and time using the built in JavaScript toLocaleDateString() function
    let dateTimeFromSQL = deal.deal_post_date_time;
    let localDateTime = new Date(dateTimeFromSQL);
    localDateTime.setMinutes(localDateTime.getMinutes() - localDateTime.getTimezoneOffset());

    let slicedDealPostDate = deal.deal_post_date_time.slice(0, 10);
    let dealPostTimeLocalFormat = localDateTime.toLocaleTimeString();
    let slicedDealExpiryDate = deal.deal_expiry_date.slice(0, 10);

    dealIdParagraph.insertAdjacentText("beforeend", "Deal ID: ");
    dealIdSpan.insertAdjacentText("beforeend", deal.deal_id);

    userIdParagraph.insertAdjacentText("beforeend", "User ID: ");
    userIdSpan.insertAdjacentText("beforeend", deal.user_id);

    dealNameParagraph.insertAdjacentText("beforeend", "Deal Name: ");
    dealNameSpan.insertAdjacentText("beforeend", deal.deal_name);

    dealPriceParagraph.insertAdjacentText("beforeend", "Price: ");
    dealPriceSpan.insertAdjacentText("beforeend", deal.deal_price);

    dealPostDateParagraph.insertAdjacentText("beforeend", "Post Date: ");
    dealPostSpan.insertAdjacentText("beforeend", `${slicedDealPostDate} at ${dealPostTimeLocalFormat}`);

    dealExpiryDateParagraph.insertAdjacentText("beforeend", "Deal Expiry Date: ");
    dealExpiryDateSpan.insertAdjacentText("beforeend", slicedDealExpiryDate);

    dealDescriptionParagraph.insertAdjacentText("beforeend", "Description: ");
    dealDescriptionSpan.insertAdjacentText("beforeend", deal.deal_description);

    dealStoreLocationParagraph.insertAdjacentText("beforeend", "Store Location: ")
    dealStoreLocationSpan.insertAdjacentText("beforeend", deal.deal_store_location);

    dealContainer.insertAdjacentElement("beforeend", dealIdParagraph);
    dealIdParagraph.insertAdjacentElement("beforeend", dealIdSpan);

    dealContainer.insertAdjacentElement("beforeend", userIdParagraph);
    userIdParagraph.insertAdjacentElement("beforeend", userIdSpan);

    dealContainer.insertAdjacentElement("beforeend", dealNameParagraph);
    dealNameParagraph.insertAdjacentElement("beforeend", dealNameSpan);

    dealContainer.insertAdjacentElement("beforeend", dealPriceParagraph);
    dealPriceParagraph.insertAdjacentElement("beforeend", dealPriceSpan);

    dealContainer.insertAdjacentElement("beforeend", dealPostDateParagraph);
    dealPostDateParagraph.insertAdjacentElement("beforeend", dealPostSpan);

    dealContainer.insertAdjacentElement("beforeend", dealExpiryDateParagraph);
    dealExpiryDateParagraph.insertAdjacentElement("beforeend", dealExpiryDateSpan);

    dealContainer.insertAdjacentElement("beforeend", dealDescriptionParagraph);
    dealDescriptionParagraph.insertAdjacentElement("beforeend", dealDescriptionSpan);

    dealContainer.insertAdjacentElement("beforeend", dealStoreLocationParagraph);
    dealStoreLocationParagraph.insertAdjacentElement("beforeend", dealStoreLocationSpan);

    let photosContainer = document.createElement("div");
    photosContainer.setAttribute("id", "photoscontainer");

    for (let photo of deal.photos) {
      let photoElement = document.createElement("img");
      photoElement.setAttribute("id", photo.photo_id);
      photoElement.setAttribute("src", photo.photo_url);
      photoElement.setAttribute("class", `dealphoto ${photo.photo_id}`);
      photosContainer.insertAdjacentElement("beforeend", photoElement);

      photoElement.addEventListener("click", e => {
        $("#edit-photo-container").data("photoId", e.target.getAttribute("id")).dialog("open");
        console.log(e.target.getAttribute("id"));
        let imageUrl = e.target.getAttribute("src");
        document.querySelector("#edit-image").setAttribute("src", imageUrl);
      })

      console.log(photo.photo_id);
      console.log(photo.photo_url);
    }

    //put the photos container inside the deal container
    dealContainer.insertAdjacentElement("beforeend", photosContainer);

    let photoEditDeleteParagraph = document.createElement("p");
    photoEditDeleteParagraph.setAttribute("id", "photoeditdeleteparagraph");
    let photoEditDeleteMessageSpan = document.createElement("span");
    photoEditDeleteMessageSpan.insertAdjacentText("beforeend", "(Tap on an image to edit or delete it)");
    photoEditDeleteParagraph.insertAdjacentElement("beforeend", photoEditDeleteMessageSpan);
    

    if (photosContainer.hasChildNodes() == true) {
      dealContainer.insertAdjacentElement("beforeend", photoEditDeleteParagraph);
    }
    
    dealContainer.insertAdjacentElement("beforeend", editDealButton);
    dealContainer.insertAdjacentElement("beforeend", deleteDealButton);
    dealsContainer.insertAdjacentElement("beforeend", dealContainer);
  }

  var editButtons = document.querySelectorAll(".edit-deal-button");

  var deleteButtons = document.querySelectorAll(".delete-deal-button");

  for (let j = 0; j < deleteButtons.length; j++) {
    deleteButtons[j].addEventListener("click", deletePost);
  }

  for (let j = 0; j < editButtons.length; j++) {
    editButtons[j].addEventListener("click", editPost);
  }

}

async function updateDeals(dealID) {

  const imageUploadElement = document.querySelector('#updatedealphotos');

  console.log(imageUploadElement.files);

  const formData = new FormData();

  //Use a loop to get the image from the image upload input and store it in a variable called file
  for (let i = 0; i < imageUploadElement.files.length; i++) {
    formData.append("files", imageUploadElement.files[i]);
  }

  console.log(`Value of the files that are uploaded: ${formData.files}`);

  //append the other deal data from the form to formData

  let updatedName = document.querySelector("#updatedealname");
  let updatedPrice = document.querySelector("#updatedealprice");
  let updatedLocation = document.querySelector("#updatedeallocation");
  let updatedDescription = document.querySelector("#updatedealdescription");
  let updatedExpireDate = document.querySelector("#updatedealexpirydate");

  if (updatedName.checkValidity() !== false && updatedPrice.checkValidity() !== false && updatedLocation.checkValidity() !== false &&
    updatedDescription.checkValidity() != false && updatedExpireDate.checkValidity() != false) {

    formData.append("dealID", dealID);
    formData.append("updatedName", updatedName.value);
    formData.append("updatedPrice", updatedPrice.value);
    formData.append("updatedLocation", updatedLocation.value);
    formData.append("updatedDescription", updatedDescription.value);
    formData.append("updatedExpireDate", updatedExpireDate.value);

    const options = {
      method: 'POST',
      body: formData,
    };

    await fetch("/update-deal", options
    ).then(function (res) {
      getDeals();
    }).catch(function (err) { ("Error:", err) }
    );
  }
}

var dealID;

function editPost(e) {

  console.log(`parentTd: ${e.target.parentNode}`);

  let parentTd = e.target.parentNode;
  let childrenElements = parentTd.children;

  let deal = [];

  for (let i = 0; childrenElements[i]; i++) {
    console.log(childrenElements[i]);
    console.log(childrenElements[i].tagName);
    if (childrenElements[i].tagName == "P") {
      if (childrenElements[i].childNodes[1] !== undefined) {
        deal.push(childrenElements[i].childNodes[1].innerText);
      }
    }
  }

  dealID = deal[0];

  document.querySelector("#updatedealname").value = deal[2];
  document.querySelector("#updatedealprice").value = deal[3];
  document.querySelector("#updatedeallocation").value = deal[7];
  document.querySelector("#updatedealdescription").value = deal[6];
  document.querySelector("#updatedealexpirydate").value = deal[5];


  //open the jQuery modal window when the edit button is clicked
  let dealexpirelabel = document.getElementById("updatedealexpirelabel");
  dealexpirelabel.classList.remove("error");
  let dealdescriptionlabel = document.getElementById("updatedealdescriptionlabel");
  dealdescriptionlabel.classList.remove("error");
  let deallocationlabel = document.getElementById("updatedeallocationlabel");
  deallocationlabel.classList.remove("error");
  let dealpricelabel = document.getElementById("updatedealpricelabel");
  dealpricelabel.classList.remove("error");
  let dealnamelabel = document.getElementById("updatedealnamelabel");
  dealnamelabel.classList.remove("error");
  $("#update-deal-container").data("dealID", dealID).dialog("open");
}

async function deletePost(e) {

  console.log(`parentTd: ${e.target.parentNode}`);

  let parentTd = e.target.parentNode;
  let childrenElements = parentTd.children;

  console.log(parentTd);
  console.log(childrenElements);

  let deal = [];

  for (let i = 0; childrenElements[i]; i++) {
    console.log(childrenElements[i]);
    console.log(childrenElements[i].tagName);
    if (childrenElements[i].tagName == "P") {
      deal.push(childrenElements[i].childNodes[1].innerText);
    }
  }

  dealID = deal[0];
  let response = await fetch("/remove-deal", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `dealID=${dealID}`
  });

  let parsedResponse = await response.json();
  parsedResponse;
  parentTd.remove();
}

$("#update-deal-container").data("dealID", dealID).dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  resizable: false,
  autoOpen: false,
  draggable: false,
  title: "Edit Deal",
  Width: 50,
  height: 500,
  buttons: [
    {
      text: "Submit",
      click: function () {
                //Checks if the input fields are filled or not, if not it will make the area not filled red
        //and doesn't close the popup 
        if (document.querySelector("#updatedealname").value != "") {
          if (document.querySelector("#updatedealprice").value != "") {
            if (document.querySelector("#updatedeallocation").value != "") {
              if (document.querySelector("#updatedealdescription").value != "") {
                if (document.querySelector("#updatedealexpirydate").value != "") {
                  updateDeals(dealID);
                  $("#update-deal-form").trigger("reset"); //clear the form when the cancel button is clicked
                  $(this).dialog("close");
                }
              }
            }
          }
        }
        if (document.querySelector("#updatedealname").value == "") {
          let errorContainer = document.getElementById("updatedealnamelabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("updatedealnamelabel");
          errorContainer.classList.remove("error");
        }
        if (document.querySelector("#updatedealprice").value == "") {
          let errorContainer = document.getElementById("updatedealpricelabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("updatedealpricelabel");
          errorContainer.classList.remove("error");
        }
        if (document.querySelector("#updatedeallocation").value == "") {
          let errorContainer = document.getElementById("updatedeallocationlabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("updatedeallocationlabel");
          errorContainer.classList.remove("error");
        }
        if (document.querySelector("#updatedealdescription").value == "") {
          let errorContainer = document.getElementById("updatedealdescriptionlabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("updatedealdescriptionlabel");
          errorContainer.classList.remove("error");
        }
        if (document.querySelector("#updatedealexpirydate").value == "") {
          let errorContainer = document.getElementById("updatedealexpirelabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("updatedealexpirelabel");
          errorContainer.classList.remove("error");
        }
      }
    },
    {
      text: "Cancel",
      click: function () {
        //select this dialog and close it when cancel is pressed
        $("#update-deal-form").trigger("reset"); //clear the form when the cancel button is clicked
        $(this).dialog("close");
      },
    }
  ],
  close: function () {
    getDeals();
  }
});

$("#edit-photo-container").dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  resizable: false,
  autoOpen: false,
  draggable: false,
  title: "Edit Photo",
  Width: 50,
  height: 500,
  buttons: [
    {
      text: "Submit",
      click: function () {
        editPhoto($("#edit-photo-container").data("photoId"));
        $("#edit-image-form").trigger("reset"); //clear the form after submitting
        $(this).dialog("close");
      }
    },
    {
      text: "Cancel",
      click: function () {
        //select this dialog and close it when cancel is pressed
        $("#deal-form").trigger("reset"); //clear the form when the cancel button is clicked
        $(this).dialog("close");
      }
    },
    {
      text: "Delete Photo",
      click: async function () {
        deletePhoto($("#edit-photo-container").data("photoId"));
        $("#edit-image-form").trigger("reset"); //clear the form when the cancel button is clicked
        $(this).dialog("close");
      }
    }
  ],
  close: function () {
    getDeals();
  }
});

async function deletePhoto(photoId) {
  let response = await fetch("/delete-photo", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `photoId=${photoId}`
  }).then(function (res) {
    getDeals();
  }).catch(function (err) { ("Error:", err) }
  );
}

async function editPhoto(photoId) {
  // e.preventDefault();

  const iupload = document.querySelector('#iupload');

  console.log(photoId);

  console.log(iupload);

  if (iupload.checkValidity() !== false) {
    const formData = new FormData();

    //Use a loop to get the image from the image upload input and store it in a variable called file
    for (let i = 0; i < iupload.files.length; i++) {
      formData.append("file", iupload.files[i]);
    }

    for (var pair of formData.entries()) {
      console.log(pair[0]);
    }

    //append the user's username to the formData that will be sent to the server
    //this allows us to update the avatar URL for the correct user in the database
    formData.append("photoId", photoId);
    console.log(photoId);

    const options = {
      method: 'POST',
      body: formData,
    };

    await fetch("/edit-image", options
    ).then(function (res) {
      getDeals();
    }).catch(function (err) { ("Error:", err) }
    );

    iupload.value = "";
  } else {

  }
}