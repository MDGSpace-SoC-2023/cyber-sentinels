function openEyeFile(event) {
  const parentButton = event.currentTarget.closest("button");
  var domname = document.getElementsByClassName("domain-name")[0].textContent;
  if (parentButton) {
    const index = parentButton.getAttribute("data-index");
    window.location.href = `eye.html?index=${index}&domain=${domname}`;
  }
}

// window.onload = function () {
//   let addCredentialsButton = document.querySelector(".add-credentials-button");
//   var domname = document.getElementsByClassName("domain-name")[0].textContent;
//   addCredentialsButton.addEventListener("click", function () {
//     window.location.href = `addcred.html?domain=${domname}`;
//   });
// };

const token = localStorage.getItem("token");
chrome.runtime.sendMessage({ token: token });
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.userData) {
    const userData = message.userData;
    updatePopup(userData);
    updateDomainName(userData);
  }
});

function updateDomainName(userData) {
  var domname = document.getElementsByClassName("domain-name")[0];
  domname.textContent = userData[0].domain.name;
}

function openEditFile(event) {
  const parentButton = event.currentTarget.closest("button");
  var domname = document.getElementsByClassName("domain-name")[0].textContent;
  if (parentButton) {
    const index = parentButton.getAttribute("data-index");
    window.location.href = `edit.html?index=${index}&domain=${domname}`;
  }
}

function updatePopup(userData) {
  var divCont = document.querySelector(".dummy-option");
  userData.forEach((element, index) => {
    var button = document.createElement("button");
    button.setAttribute("data-index", index);
    var topLeftDiv = document.createElement("div");
    topLeftDiv.className = "top-left";
    var orangeBox = document.createElement("div");
    orangeBox.className = "box orange";
    orangeBox.setAttribute("data-index", index);
    var spanElement = document.createElement("span");
    spanElement.className = "sync-text";
    spanElement.textContent = element.sync ? "SYNC" : "NULL";
    orangeBox.appendChild(spanElement);
    var greenBox = document.createElement("div");
    greenBox.className = "box green";
    greenBox.setAttribute("data-index", index);
    greenBox.textContent = element.notes;
    topLeftDiv.appendChild(orangeBox);
    topLeftDiv.appendChild(greenBox);
    var dummyTextSpan = document.createElement("span");
    dummyTextSpan.className = "dummy-text";
    dummyTextSpan.textContent = element.username;
    var iconsDiv = document.createElement("div");
    iconsDiv.className = "icons";
    var visibilityIcon = document.createElement("span");
    visibilityIcon.className = "material-symbols-outlined eye-icon";
    visibilityIcon.textContent = "visibility";
    visibilityIcon.onclick = openEyeFile;
    var editIcon = document.createElement("span");
    editIcon.className = "material-symbols-outlined edit-icon";
    editIcon.textContent = "edit";
    editIcon.onclick = openEditFile;
    iconsDiv.appendChild(visibilityIcon);
    iconsDiv.appendChild(editIcon);
    button.appendChild(topLeftDiv);
    button.appendChild(dummyTextSpan);
    button.appendChild(iconsDiv);
    divCont.appendChild(button);
  });
}

function openaddCred() {
  var domname = document.getElementsByClassName("domain-name")[0].textContent;
  window.location.href = `addcred.html?domain=${domname}`;
}

let addCredentialsButton = document.querySelector(".add-credentials-button");
  addCredentialsButton.addEventListener("click", openaddCred);
