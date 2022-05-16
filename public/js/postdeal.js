let postDealLink = document.querySelector("#post-deal-link")

postDealLink.addEventListener("click", e => {
  $("#post-deal-link").dialog("open");
})



$("#post-deal-container").dialog({
  modal: true,
  fuild: true, //prevent horizontal scroll bars on mobile layout
  autoOpen: false,
  draggable: false,
  title: "Create New User",
  Width: 50,
  height: 500,
  buttons: [
    {
      text: "Submit",
      click: function () {

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