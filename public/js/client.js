"use strict;"

const loginButton = document.querySelector("#login-button");

loginButton.addEventListener("click", async e => {
  e.preventDefault();
  
  let usernameElement = document.querySelector("#username");
  let passwordElement = document.querySelector("#password");

  let username = usernameElement.value;
  let password = passwordElement.value;

  let response = await fetch("/login", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `username=${username}&password=${password}`
  });

  let parsedResponse = await response.json();

  if (parsedResponse.status === "fail") {
    document.querySelector("#error-message").innerHTML = "";
    document.querySelector("#error-message").insertAdjacentText("afterbegin", parsedResponse.message);
  }
  else {
    window.location.replace("/profile");
  }
});