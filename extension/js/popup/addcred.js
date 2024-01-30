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

function generateDeviceId() {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    navigator.hardwareConcurrency,
    navigator.serviceWorker,
    navigator.mediaCapabilities,
    new Date().getTimezoneOffset(),
  ].join('');
  console.log(navigator.mediaCapabilities);
  const hashedId = hashString(fingerprint);

  return hashedId;
}
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return hash.toString(16);
}

cancelButton.addEventListener("click", function () {
  var targetDomain = document.getElementById("domain").value;
  window.location.href = `listview.html?target_domain=${targetDomain}`;
});

const token = localStorage.getItem("token");
chrome.runtime.sendMessage({ token: token });

async function createPassword(event) {
  event.preventDefault();
  var response3 = await fetch("http://127.0.0.1:8000/auth/csrf/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  var data2 = await response3.json();
  const csrfToken = data2.csrf;
  var domain = document.querySelector("#domain").value;
  var username = document.querySelector("#username").value;
  var password = document.querySelector("#passwordField").value;
  var sync = document.querySelector("#sync").checked;
  var notes = document.querySelector("#customText").value;
  var response = await fetch("http://127.0.0.1:8000/auth/master", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  var data = await response.json();
  const hashedMasterPassword = data.hashedMasterPassword;
  const salt = data.salt;
  const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  });
  const secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
  var encryptedData = CryptoJS.AES.encrypt(password, secretKey).toString();
  var deviceId = generateDeviceId();
  fetch(`http://127.0.0.1:8000/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      domain_name: domain,
      username: username,
      encrypted_password: encryptedData,
      sync: sync,
      notes: notes,
      device_identifier: deviceId,
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
  var targetDomain = document.getElementById("domain").value;
  window.location.href = `listview.html?target_domain=${targetDomain}`;
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
) { });

const savebtn = document.getElementById("saveButton");
savebtn.addEventListener("click", createPassword);
