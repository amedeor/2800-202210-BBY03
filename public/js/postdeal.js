let dealSubmitButton = document.querySelector("#create-deal-submit-button");

dealSubmitButton.addEventListener("click", e => { 
  e.preventDefault();
  createPost();

}
);

async function createPost() {
  // e.preventDefault();

  // let createPostAvatarUrl;

  let createForm = document.querySelector("#create-record-form");
  let createFileUploadInput = document.querySelector("#create-image-upload");


  let createPostname = document.querySelector("#createdealname").value;
  let createDealPrice = document.querySelector("#createdealprice").value;
  let createDealDesc = document.querySelector("#createdealdescription").value;
  let createDealExpireDate = document.querySelector("#createdealexpirydate").value;
  // let createDealPhotos = document.querySelector("#createdealphotos").value;

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
    body: `createPostname=${createPostname}&createDealPrice=${createDealPrice}&createDealDesc=${createDealDesc}&createDealExpireDate=${createDealExpireDate}`
  });

  let parsedResponse = await response.json();

  if (parsedResponse.status === "success") {
    document.querySelector("#status").innerHTML = "";
    document.querySelector("#status").insertAdjacentText("afterbegin", parsedResponse.message);
  } else {
    console.log(parsedResponse.status);
  }

}