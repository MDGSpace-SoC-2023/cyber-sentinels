const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
  var targetDomain = document.getElementById("domain").value;
  window.location.href = `listview.html?target_domain=${targetDomain}`;
});

const donebtn = document.getElementById("done");

donebtn.addEventListener("click", () => {
  document.querySelector(".popup").style.display = "none";
  close(".popup");
});

const token = localStorage.getItem("token");
chrome.runtime.sendMessage({ token: token });
document.addEventListener("DOMContentLoaded", async function () {
  async function updatePopup(userData) {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get("index");
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
      customTextField.value = userDataAtIndex.notes || "";
      domainfield.value = domain;
    }
  }

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.userData) {
      const userData = message.userData;
      updatePopup(userData);
    }
  });

  chrome.storage.local.get("userData", function (result) {
    const userData = result.userData;
    updatePopup(userData);
  });
});
