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

    let dealName = document.querySelector("#dealname").value;
    let dealPrice = document.querySelector("#dealprice").value;
    let dealDescription = document.querySelector("#dealdescription").value;
    let dealLocation = document.querySelector("#deallocation").value;
    let dealExpiryDate = document.querySelector("#dealexpirydate").value;
  
    console.log(dealName);
    console.log(dealPrice);
    console.log(dealDescription);
    console.log(dealLocation);
    console.log(dealExpiryDate);

    formData.append("dealName", dealName);
    formData.append("dealPrice", dealPrice);
    formData.append("dealDescription", dealDescription);
    formData.append("dealLocation", dealLocation);
    formData.append("dealExpiryDate", dealExpiryDate);
  
    const options = {
      method: 'POST',
      body: formData,
    };
  
    await fetch("/post-deal", options
    ).then(function (res) {
  
    }).catch(function (err) { ("Error:", err) }
    );
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
  ]
});

//This block of code to center the jQuery UI modal popup when the window is resized is from
//https://stackoverflow.com/questions/3060146/how-to-auto-center-jquery-ui-dialog-when-resizing-browser
//with adaptatations made to apply to my modal window
$(window).resize(function(){
  $("#post-deal-container").dialog( "option", "position", { my: "center", at: "center", of: window } );
});