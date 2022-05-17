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

    console.log(formData.files);

    //append the other deal data from the form to formData

    formData.append("dealName", document.querySelector("#dealname"));
    formData.append("dealPrice", document.querySelector("#dealprice"));
    formData.append("dealLocation", document.querySelector("#deallocation"));
    formData.append("dealDescription", document.querySelector("dealdescription"));
    formData.append("dealExpiryDate", document.querySelector("#dealexpirydate"));



  
    //append the user's username to the formData that will be sent to the server
    //this allows us to update the avatar URL for the correct user in the database
    // formData.append("username", document.querySelector(".username").innerText);
  
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
$(window).resize(function(){
  $("#post-deal-container").dialog( "option", "position", { my: "center", at: "center", of: window } );
});