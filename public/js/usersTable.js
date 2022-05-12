let data = JSON.parse(this.responseText);

for (let i; i < data.length; i++) {

    console.log(row[i].user_username);

    // tr.setAttribute('id', `"TR${row[i].user_username}"`);
    
    // tdUsername.setAttribute('id', `"TD${userUsername}"`);

    // tdUsername.insertAdjacentText("afterbegin", userUsername);
    // tdFirstName.insertAdjacentText("afterbegin", userFirstname);
    // tdLastName.insertAdjacentText("afterbegin", userLastname);
    // tdEmail.insertAdjacentText("afterbegin", userEmail);
    // tdUserType.insertAdjacentText("afterbegin", userType);
    // tdUserAvatarUrl.insertAdjacentHTML("afterbegin", `<img src="${userAvatarUrl}" />`);
    // tdDeleteUser.insertAdjacentHTML("afterbegin", `<input type="button" id="deleteButton${userUsername}" value="Delete" />`);

    // tbody.insertAdjacentElement("beforeend", tr);

    // tr.insertAdjacentElement("beforeend", tdUsername);
    // tr.insertAdjacentElement("beforeend", tdFirstName);
    // tr.insertAdjacentElement("beforeend", tdLastName);
    // tr.insertAdjacentElement("beforeend", tdEmail);
    // tr.insertAdjacentElement("beforeend", tdUserType);
    // tr.insertAdjacentElement("beforeend", tdUserAvatarUrl);
    // tr.insertAdjacentElement("beforeend", tdDeleteUser);

    // let deleteButton = usersDOM.window.document.querySelector(`#deleteButton${userUsername}`);

    // function deleteRow(r) {
    //   var i = r.parentNode.parentNode.rowIndex;
    //   usersDOM.window.document.getElementById("myTable").deleteRow(i);
    // }

    // deleteButton.addEventListener("click", async e => {
    //   deleteRow(deleteButton);
    // });
  }