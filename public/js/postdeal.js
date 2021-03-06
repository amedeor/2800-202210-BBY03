"use strict";

let postDealLink = document.querySelector("#post-deal-link");

// Adds an event listener to the "Post Deal" button to open the popup form
postDealLink.addEventListener("click", e => {
  let dealexpirelabel = document.getElementById("dealexpirelabel");
  dealexpirelabel.classList.remove("error");
  let dealdescriptionlabel = document.getElementById("dealdescriptionlabel");
  dealdescriptionlabel.classList.remove("error");
  let deallocationlabel = document.getElementById("deallocationlabel");
  deallocationlabel.classList.remove("error");
  let dealpricelabel = document.getElementById("dealpricelabel");
  dealpricelabel.classList.remove("error");
  let dealnamelabel = document.getElementById("dealnamelabel");
  dealnamelabel.classList.remove("error");
  //when the jQuery modal opens, clear the nicEdit textarea
  let dealDescriptionNicEditor = new nicEditors.findEditor("dealdescription");
  //set the NicEditor text area to empty to remove the default <br> tag in the textarea before the modal window opens
  dealDescriptionNicEditor.setContent(""); 
  $("#post-deal-container").dialog("open");
});

//Function to upload a new avatar image on the user's profile page
async function postDeal() {

  const imageUploadElement = document.querySelector('#dealphotos');
  const formData = new FormData();

  //Use a loop to get the image from the image upload input and store it in a variable called file
  for (let i = 0; i < imageUploadElement.files.length; i++) {
    formData.append("files", imageUploadElement.files[i]);
  }

  let dealName = document.querySelector("#dealname");
  let dealPrice = document.querySelector("#dealprice");
  //let dealDescription = document.querySelector("#dealdescription");
  let dealLocation = document.querySelector("#deallocation");
  let dealExpiryDate = document.querySelector("#dealexpirydate");

  let dealDescriptionNicEditor = new nicEditors.findEditor("dealdescription");

  if (dealName.checkValidity() !== false && dealPrice.checkValidity() !== false && dealDescriptionNicEditor.getContent() !== "" &&
    dealLocation.checkValidity() != false && dealExpiryDate.checkValidity() != false) {

    formData.append("dealName", dealName.value);
    formData.append("dealPrice", dealPrice.value);
    formData.append("dealDescription", dealDescriptionNicEditor.getContent());
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

// Modal popup form for posting deals
$("#post-deal-container").dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  resizable: false,
  autoOpen: false,
  draggable: false,
  title: "Post a Deal",
  width: 300,
  height: 500,
  buttons: [
    {
      text: "Submit",
      click: function () {
        //Checks if the input fields are filled or not, if not it will make the area not filled red
        //and doesn't close the popup 
        if (document.querySelector("#dealname").value != "" && document.querySelector("#dealprice").value != ""
          && document.querySelector("#deallocation").value != "" && new nicEditors.findEditor("dealdescription").getContent() != ""
          && document.querySelector("#dealexpirydate").value != "") {
          postDeal();
          $("#deal-form").trigger("reset"); //clear the form when the cancel button is clicked
          new nicEditors.findEditor("dealdescription").setContent("");
          $(this).dialog("close");
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
        if (new nicEditors.findEditor("dealdescription").getContent() == "") {
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
