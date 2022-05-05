"use strict;"

const loginButton = document.querySelector("#login-button");

const signupButton = document.querySelector("#signup-button");

const goToSignupButton = document.querySelector("#go-to-signup-button");

const viewUserAccountsButton = document.querySelector("#view-user-accounts-button");

if (loginButton != null) {
  loginButton.addEventListener("click", async e => {

    let usernameElement = document.querySelector("#username");
    let passwordElement = document.querySelector("#password");

    if (usernameElement.checkValidity() !== false && passwordElement.checkValidity() !== false) {

      e.preventDefault();

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
    }
  });
}

if (goToSignupButton != null) {
  goToSignupButton.addEventListener("click", async e => {
    e.preventDefault();
    window.location.replace("/signup");
  });
}

if (signupButton != null) {
  signupButton.addEventListener("click", async e => {

    let signupFNameElement = document.querySelector("#signup-fName");
    let signupLNameElement = document.querySelector("#signup-lName");
    let signupEmailElement = document.querySelector("#signup-email");
    let signupUsernameElement = document.querySelector("#signup-username");
    let signupPasswordElement = document.querySelector("#signup-password");

    //Check the validity of each HTML5 element
    //If the HTML5 element validity doesn't pass, then do not fetch /createUser and prevent user from signing up
    if (signupFNameElement.checkValidity() !== false && signupLNameElement.checkValidity() !== false && signupEmailElement.checkValidity() !== false &&
      signupUsernameElement.checkValidity() != false && signupPasswordElement.checkValidity() != false) {

      e.preventDefault();

      let signupFName = signupFNameElement.value;
      let signupLName = signupLNameElement.value;
      let signupEmail = signupEmailElement.value;
      let signupUsername = signupUsernameElement.value;
      let signupPassword = signupPasswordElement.value;


      let response = await fetch("/createUser", {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `signupFName=${signupFName}&signupLName=${signupLName}&signupEmail=${signupEmail}&signupUsername=${signupUsername}&signupPassword=${signupPassword}`
      });

      let parsedResponse = await response.json();

      if (parsedResponse.status === "fail") {
        document.querySelector("#error-message").innerHTML = "";
        document.querySelector("#error-message").insertAdjacentText("afterbegin", parsedResponse.message);
      } else {
        let response = await fetch("/login", {
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `username=${signupUsername}&password=${signupPassword}`
        });

        let parsedResponse = await response.json();
        parsedResponse;
        window.location.replace("/profile");
      }
    }
  });
}

// if (viewUserAccountsButton != null) {
//   viewUserAccountsButton.addEventListener("click", async e => {
//     e.preventDefault();
//     let response = await fetch("/users");
//   });
// }