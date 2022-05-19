"use strict";

let postDealLink = document.querySelector("#post-deal-link");


postDealLink.addEventListener("click", e => {
  $("#post-deal-container").dialog("open");
})

//Function to upload a new avatar image on the user's profile page
async function uploadImages() {

  const imageUploadElement = document.querySelector('#dealphotos');

  console.log(imageUploadElement.files);
  ;
  console.log("UploadImages called");

  const formData = new FormData();

  //Use a loop to get the image from the image upload input and store it in a variable called file
  for (let i = 0; i < imageUploadElement.files.length; i++) {
    formData.append("files", imageUploadElement.files[i]);
  }

  console.log(`Value of the files that are uploaded: ${formData.files}`);

  //append the other deal data from the form to formData

  let dealName = document.querySelector("#dealname");
  let dealPrice = document.querySelector("#dealprice");
  let dealDescription = document.querySelector("#dealdescription");
  let dealLocation = document.querySelector("#deallocation");
  let dealExpiryDate = document.querySelector("#dealexpirydate");

  if (dealName.checkValidity() !== false && dealPrice.checkValidity() !== false && dealDescription.checkValidity() !== false &&
    dealLocation.checkValidity() != false && dealExpiryDate.checkValidity() != false) {

    // console.log(dealName);
    // console.log(dealPrice);
    // console.log(dealDescription);
    // console.log(dealLocation);
    // console.log(dealExpiryDate);

    formData.append("dealName", dealName.value);
    formData.append("dealPrice", dealPrice.value);
    formData.append("dealDescription", dealDescription.value);
    formData.append("dealLocation", dealLocation.value);
    formData.append("dealExpiryDate", dealExpiryDate.value);

    const options = {
      method: 'POST',
      body: formData,
    };

    await fetch("/post-deal", options
    ).then(function (res) {
      getDeals();
    }).catch(function (err) { ("Error:", err) }
    );
  }
}

$("#post-deal-container").dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  resizable: false,
  autoOpen: false,
  draggable: false,
  title: "Post a Deal",
  Width: 50,
  height: 500,
  buttons: [
    {
      text: "Submit",
      click: function () {
        uploadImages();
        $("#deal-form").trigger("reset"); //clear the form when the cancel button is clicked
        // getDeals();
        $(this).dialog("close");
      }
    },
    {
      text: "Cancel",
      click: function () {
        //select this dialog and close it when cancel is pressed
        $("#deal-form").trigger("reset"); //clear the form when the cancel button is clicked
        $(this).dialog("close");
      },
    }
  ],
  close: function () {
    getDeals();
  }
});

//This block of code to center the jQuery UI modal popup when the window is resized is from
//https://stackoverflow.com/questions/3060146/how-to-auto-center-jquery-ui-dialog-when-resizing-browser
//with adaptatations made to apply to my modal window
$(window).resize(function () {
  $("#post-deal-container").dialog("option", "position", { my: "center", at: "center", of: window });
});


// async function getDeals() {

//   let response = await fetch("/get-deals");

//   let parsedResponse = await response.json();

//   // console.log(parsedResponse);

//   let dealsContainer = document.querySelector("#deals");

//   dealsContainer.innerHTML = "";

//   for (let deal of parsedResponse.usersDeals) {

//     let dealContainer = document.createElement("div");

//     //set the id of the deal container to the id of the specific deal
//     dealContainer.setAttribute("id", deal.deal_id);
//     dealContainer.setAttribute("class", "deal-container");

//     let dealIdParagraph = document.createElement("p");
//     let dealIdSpan = document.createElement("span");

//     let userIdParagraph = document.createElement("p");
//     let userIdSpan = document.createElement("span");

//     let dealNameParagraph = document.createElement("p");
//     let dealNameSpan = document.createElement("span");

//     let dealPriceParagraph = document.createElement("p");
//     let dealPriceSpan = document.createElement("span");

//     let dealPostDateParagraph = document.createElement("p");
//     let dealPostSpan = document.createElement("span");

//     let dealExpiryDateParagraph = document.createElement("p");
//     let dealExpiryDateSpan = document.createElement("span");

//     let dealDescriptionParagraph = document.createElement("p");
//     let dealDescriptionSpan = document.createElement("span");

//     let dealStoreLocationParagraph = document.createElement("p");
//     let dealStoreLocationSpan = document.createElement("span");

//     let editDealButton = document.createElement("input");
//     editDealButton.setAttribute("class", "edit-deal-button");
//     editDealButton.setAttribute("type", "submit");
//     editDealButton.setAttribute("value", "edit deal");

//     let deleteDealButton = document.createElement("input");
//     deleteDealButton.setAttribute("class", "delete-deal-button");
//     deleteDealButton.setAttribute("type", "submit");
//     deleteDealButton.setAttribute("value", "delete deal");


//     //This block of code to calculate the local time using the built in JavaScript getTimezoneOffset() function is from 
//     //https://stackoverflow.com/questions/7403486/add-or-subtract-timezone-difference-to-javascript-date
//     //with adaptatations made to display the local date and time using the built in JavaScript toLocaleDateString() function
//     let dateTimeFromSQL = deal.deal_post_date_time;
//     let localDateTime = new Date(dateTimeFromSQL);
//     localDateTime.setMinutes(localDateTime.getMinutes() - localDateTime.getTimezoneOffset());

//     let slicedDealPostDate = deal.deal_post_date_time.slice(0, 10);
//     let dealPostTimeLocalFormat = localDateTime.toLocaleTimeString();
//     let slicedDealExpiryDate = deal.deal_expiry_date.slice(0, 10);

//     dealIdParagraph.insertAdjacentText("beforeend", "Deal ID: ");
//     dealIdSpan.insertAdjacentText("beforeend", deal.deal_id);

//     userIdParagraph.insertAdjacentText("beforeend", "User ID: ");
//     userIdSpan.insertAdjacentText("beforeend", deal.user_id);

//     dealNameParagraph.insertAdjacentText("beforeend", "Deal Name: ");
//     dealNameSpan.insertAdjacentText("beforeend", deal.deal_name);

//     dealPriceParagraph.insertAdjacentText("beforeend", "Price: ");
//     dealPriceSpan.insertAdjacentText("beforeend", deal.deal_price);

//     dealPostDateParagraph.insertAdjacentText("beforeend", "Post Date: ");
//     dealPostSpan.insertAdjacentText("beforeend", `${slicedDealPostDate} at ${dealPostTimeLocalFormat}`);

//     dealExpiryDateParagraph.insertAdjacentText("beforeend", "Deal Expiry Date: ");
//     dealExpiryDateSpan.insertAdjacentText("beforeend", slicedDealExpiryDate);

//     dealDescriptionParagraph.insertAdjacentText("beforeend", "Description: ");
//     dealDescriptionSpan.insertAdjacentText("beforeend", deal.deal_description);

//     dealStoreLocationParagraph.insertAdjacentText("beforeend", "Store Location: ")
//     dealStoreLocationSpan.insertAdjacentText("beforeend", deal.deal_store_location);

//     dealContainer.insertAdjacentElement("beforeend", dealIdParagraph);
//     dealIdParagraph.insertAdjacentElement("beforeend", dealIdSpan);

//     dealContainer.insertAdjacentElement("beforeend", userIdParagraph);
//     userIdParagraph.insertAdjacentElement("beforeend", userIdSpan);

//     dealContainer.insertAdjacentElement("beforeend", dealNameParagraph);
//     dealNameParagraph.insertAdjacentElement("beforeend", dealNameSpan);

//     dealContainer.insertAdjacentElement("beforeend", dealPriceParagraph);
//     dealPriceParagraph.insertAdjacentElement("beforeend", dealPriceSpan);

//     dealContainer.insertAdjacentElement("beforeend", dealPostDateParagraph);
//     dealPostDateParagraph.insertAdjacentElement("beforeend", dealPostSpan);

//     dealContainer.insertAdjacentElement("beforeend", dealExpiryDateParagraph);
//     dealExpiryDateParagraph.insertAdjacentElement("beforeend", dealExpiryDateSpan);

//     dealContainer.insertAdjacentElement("beforeend", dealDescriptionParagraph);
//     dealDescriptionParagraph.insertAdjacentElement("beforeend", dealDescriptionSpan);

//     dealContainer.insertAdjacentElement("beforeend", dealStoreLocationParagraph);
//     dealStoreLocationParagraph.insertAdjacentElement("beforeend", dealStoreLocationSpan);

//     // console.log(deal.deal_id);
//     // console.log(deal.user_id);
//     // console.log(deal.deal_price);
//     // console.log(deal.deal_description);
//     // console.log(deal.deal_store_location);

//     for (let photo of deal.photos) {
//       let photoElement = document.createElement("img");
//       photoElement.setAttribute("id", photo.photo_id);
//       photoElement.setAttribute("src", photo.photo_url);
//       photoElement.setAttribute("class", `dealphoto ${photo.photo_id}`);
//       dealContainer.insertAdjacentElement("beforeend", photoElement);

//       photoElement.addEventListener("click", e => {
//         $("#edit-photo-container").data("photoId", e.target.getAttribute("id")).dialog("open");
//         console.log(e.target.getAttribute("id"));
//         let imageUrl = e.target.getAttribute("src");
//         document.querySelector("#edit-image").setAttribute("src", imageUrl);
//       })


//       console.log(photo.photo_id);
//       console.log(photo.photo_url);
//     }

//     dealContainer.insertAdjacentElement("beforeend", editDealButton);
//     dealContainer.insertAdjacentElement("beforeend", deleteDealButton);
//     dealsContainer.insertAdjacentElement("beforeend", dealContainer);
//   }

//   var editButtons = document.querySelectorAll(".edit-deal-button");

//   var deleteButtons = document.querySelectorAll(".delete-deal-button");

//   for (let j = 0; j < deleteButtons.length; j++) {
//     deleteButtons[j].addEventListener("click", deletePost);
//   }

//   for (let j = 0; j < editButtons.length; j++) {
//     editButtons[j].addEventListener("click", editPost);
//   }

// }