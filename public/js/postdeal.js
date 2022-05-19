"use strict";

let postDealLink = document.querySelector("#post-deal-link");


postDealLink.addEventListener("click", e => {
  $("#post-deal-container").dialog("open");
})

//Function to upload a new avatar image on the user's profile page
async function postDeal() {

  const imageUploadElement = document.querySelector('#dealphotos');

  console.log(imageUploadElement.files);
  
  console.log("postDeal called");

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
        //Checks if the input fields are filled or not, if not it will make the area not filled red
        //and doesn't close the popup 
        if (document.querySelector("#dealname").value != "") {
          if (document.querySelector("#dealprice").value != "") {
            if (document.querySelector("#deallocation").value != "") {
              if (document.querySelector("#dealdescription").value != "") {
                if (document.querySelector("#dealexpirydate").value != "") {
                  postDeal();
                  $("#deal-form").trigger("reset"); //clear the form when the cancel button is clicked
                  $(this).dialog("close");
                }
              }
            }
          }
        }
        if (document.querySelector("#dealname").value == "") {
          let errorContainer = document.getElementById("dealnamelabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("dealnamelabel");
          errorContainer.classList.remove("error");
        }
        if (document.querySelector("#dealprice").value == "") {
          let errorContainer = document.getElementById("dealpricelabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("dealpricelabel");
          errorContainer.classList.remove("error");
        }
        if (document.querySelector("#deallocation").value == "") {
          let errorContainer = document.getElementById("deallocationlabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("deallocationlabel");
          errorContainer.classList.remove("error");
        }
        if (document.querySelector("#dealdescription").value == "") {
          let errorContainer = document.getElementById("dealdescriptionlabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("dealdescriptionlabel");
          errorContainer.classList.remove("error");
        }
        if (document.querySelector("#dealexpirydate").value == "") {
          let errorContainer = document.getElementById("dealexpirelabel");
          errorContainer.classList.add("error");
        } else {
          let errorContainer = document.getElementById("dealexpirelabel");
          errorContainer.classList.remove("error");
        }
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
