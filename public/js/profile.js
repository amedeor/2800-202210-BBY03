"use strict;"





//Code for edit window
// Get the modal
var modal = document.getElementById("editWindow");

// Get the button that opens the modal
var btn = document.getElementById("edit-profile-button");

// Get the close button to close the modal
var span = document.getElementsByClassName("cancel")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user uses button "cancel"
span.onclick = function() {
  modal.style.display = "none";
}
