const cancelButton = document.getElementById("cancelButton");

cancelButton.addEventListener("click", function (event) {
  event.preventDefault();
  var targetDomain = document.getElementById("domain").value;
  window.location.href = `listview.html?target_domain=${targetDomain}`;
});

const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", async function (event) {
  event.preventDefault();
  await updateData();
  var targetDomain = document.getElementById("domain").value;
  window.location.href = `listview.html?target_domain=${targetDomain}`;
});

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

const token = localStorage.getItem("token");
chrome.runtime.sendMessage({ token: token });

var index, userData;
document.addEventListener("DOMContentLoaded", async function () {
  async function updatePopup(userData) {
    const urlParams = new URLSearchParams(window.location.search);
    index = urlParams.get("index");
    const domain = urlParams.get("domain");
    const domainfield = document.getElementById("domain");
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("passwordField");
    const syncCheckbox = document.getElementById("sync");
    const customTextField = document.getElementById("customText");
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
    if (Array.isArray(userData) && userData.length > index) {
      const userDataAtIndex = userData[index];
      usernameField.value = userDataAtIndex.username || "";
      var decryptedBytes = CryptoJS.AES.decrypt(
        userDataAtIndex.encrypted_password,
        secretKey
      );
      var decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      passwordField.value = decryptedData;
      syncCheckbox.checked = userDataAtIndex.sync || false;
      var tagcontent = userDataAtIndex.notes;
      customTextField.value = tagcontent;
      domainfield.value = domain;
    }
  }

  chrome.storage.local.get("userData", function (result) {
    userData = result.userData;
    updatePopup(userData);
  });
});

async function updateData() {
  const userDataAtIndex = userData[index];
  const userId = userDataAtIndex.id;
  var response = await fetch("http://127.0.0.1:8000/auth/master", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  var password = document.getElementById("passwordField").value;
  var data = await response.json();
  const hashedMasterPassword = data.hashedMasterPassword;
  const salt = data.salt;
  const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  });
  const secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
  var encryptedData = CryptoJS.AES.encrypt(password, secretKey).toString();
  const updatedData = {
    id: userId,
    user: userDataAtIndex.user,
    sync: document.getElementById("sync").checked,
    encrypted_password: encryptedData,
    username: document.getElementById("username").value,
    notes: document.getElementById("customText").value,
    updated_at: userDataAtIndex.updated_at,
    device_identifier: userDataAtIndex.device_identifier,
    domain: {
      id: userDataAtIndex.domain.id,
      name: userDataAtIndex.domain.name,
      vault: userDataAtIndex.domain.vault,
    },
  };
  var response3 = await fetch("http://127.0.0.1:8000/auth/csrf/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  var data2 = await response3.json();
  const csrfToken = data2.csrf;
  var response2 = await fetch(`http://127.0.0.1:8000/${userId}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  try {
    if (!response2.ok) {
      return response2.json().then((errors) => {
        throw new Error(JSON.stringify(errors));
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
