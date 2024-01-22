const togglePasswordClosed = document.getElementById(
  "togglePasswordVisibilityClosed"
);
const togglePasswordOpen = document.getElementById(
  "togglePasswordVisibilityOpen"
);
const passwordField = document.getElementById("passwordField");

togglePasswordClosed.addEventListener("click", function () {
  passwordField.type = "text";
  togglePasswordClosed.style.display = "none";
  togglePasswordOpen.style.display = "inline";
});

togglePasswordOpen.addEventListener("click", function () {
  passwordField.type = "password";
  togglePasswordOpen.style.display = "none";
  togglePasswordClosed.style.display = "inline";
});

const cancelButton = document.getElementById("cancelButton");

cancelButton.addEventListener("click", function () {
  window.location.href = "listview.html";
});

const token = localStorage.getItem("token");
chrome.runtime.sendMessage({ token: token });

function createPassword(event) {
  event.preventDefault();
  var domain = document.querySelector("#domain").value;
  var username = document.querySelector("#username").value;
  var password = document.querySelector("#passwordField").value;
  var sync = document.querySelector("#sync").checked;
  var notes = document.querySelector("#customText").value;
  fetch(`http://127.0.0.1:8000/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    body: JSON.stringify({
      domain_name: domain,
      username: username,
      encrypted_password: password,
      sync: sync,
      notes: notes,
      device_identifier: "asdfasd",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errors) => {
          throw new Error(JSON.stringify(errors));
        });
      }
    })
    .catch((error) => console.log(error));
    window.location.href = "listview.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const domain = urlParams.get("domain");
  updateDomainName(domain);
});

function updateDomainName(domain) {
  var domname = document.getElementById("domain");
  domname.value = domain;
}

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  sendResponse
) {});

const savebtn = document.getElementById("saveButton");
savebtn.addEventListener("click", createPassword);
