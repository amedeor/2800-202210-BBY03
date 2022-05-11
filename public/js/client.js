"use strict;"

const loginButton = document.querySelector("#login-button");

const signupButton = document.querySelector("#signup-button");

const goToSignupButton = document.querySelector("#go-to-signup-button");

const viewUserAccountsButton = document.querySelector("#view-user-accounts-button");

const logoutIcon = document.querySelector("#logout-icon");

const profileIcon = document.querySelector("#profile-icon");

const logoutButton = document.querySelector("#logout-button");

const profileButton = document.querySelector("#profile-button");

const saveEditButton = document.querySelector("#save-button");

//Check if the logout icon is null, if it is not, attach an event listener to the link that will fire the /logout get request
if (logoutIcon != null) {
  logoutIcon.addEventListener("click", async e => {
    if (logoutButton != null) {
      logoutButton.click();
    }
  });
}

//Check if the profile icon is null, if it is not, attach an event listener to the link that will fire the /profile get request
if (profileIcon != null) {
  profileIcon.addEventListener("click", async e => {
    if (logoutButton != null) {
      profileButton.click();
    }
  });
}

if (saveEditButton != null) {
  saveEditButton.addEventListener("click", async e => {

    e.preventDefault();

    let currentUserNameElement = document.querySelector(".username");

    let userNameElement = document.querySelector("#formUserName");
    let firstNameElement = document.querySelector("#formFirstName");
    let lastNameElement = document.querySelector("#formLastName");
    let emailElement = document.querySelector("#formEmail");
    let passwordElement = document.querySelector("#formPassword");

      let currentUserName = currentUserNameElement.value;
      let userName = userNameElement.value;
      let firstName = firstNameElement.value;
      let lastName = lastNameElement.value;
      let email = emailElement.value;
      let password = passwordElement.value;

      let response = await ("/update-admin-user", {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `currentUserName=${currentUserName}userName=${userName}&firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}`
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


  )
}

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