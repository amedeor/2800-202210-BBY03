let dealSubmitButton = document.querySelector("#deal-submit-button");

dealSubmitButton.addEventListener("click", e => { 
  e.preventDefault();


}
);

async function createPost() {
  // e.preventDefault();

  // let createPostAvatarUrl;

  let createForm = document.querySelector("#create-record-form");
  let createFileUploadInput = document.querySelector("#create-image-upload");

  let id = document.querySelector("#id").value;

  let createPostname = document.querySelector("#createdealname").value;
  let createFirstname = document.querySelector("#createdealprice").value;
  let createLastname = document.querySelector("#createdealdescription").value;
  let createEmail = document.querySelector("#createdealexpirydate").value;
  let createPassword = document.querySelector("#createdealphotos").value;

  // if (createFileUploadInput.value != "") {
  //   createPostAvatarUrl = document.querySelector("#create-image-upload").value;
  // } else {
  //   createPostAvatarUrl = "/img/default-avatar.svg";
  // }

  let response = await fetch("/create-post", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `createPostname=${createPostname}&createPassword=${createPassword}&createFirstname=${createFirstname}&createLastname=${createLastname}&createEmail=${createEmail}&createPosttype=${createPosttype}&createPostAvatarUrl=${createPostAvatarUrl}`
  });

  let parsedResponse = await response.json();

  if (parsedResponse.status === "success") {
    document.querySelector("#status").innerHTML = "";
    document.querySelector("#status").insertAdjacentText("afterbegin", parsedResponse.message);
  } else {
    console.log(parsedResponse.status);
  }


  uploadCreateImage(createPostname);

  //refresh the table after updating the record.
  getUsers();

  // //reset the user data form
   createForm.reset();

}