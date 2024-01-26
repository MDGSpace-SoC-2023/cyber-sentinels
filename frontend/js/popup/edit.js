const cancelButton = document.getElementById("cancelButton");

cancelButton.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "listview.html";
});

const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", function (event) {
  updateData();
  event.preventDefault();
  window.location.href = "listview.html";
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

document.addEventListener("DOMContentLoaded", function () {
  // Function to update the popup with user data
  function updatePopup(userData) {
    console.log("Received userData:", userData);

    // Extract the index from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get("index");
    const domain = urlParams.get("domain");
    const domainfield = document.getElementById("domain");
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("passwordField");
    const syncCheckbox = document.getElementById("sync");
    // const devCheckbox = document.getElementById("device");
    const customTextField = document.getElementById("customText");

    // Use the index to access the corresponding user data
    if (Array.isArray(userData) && userData.length > index) {
      const userDataAtIndex = userData[index];
      usernameField.value = userDataAtIndex.username || "";
      passwordField.value = userDataAtIndex.encrypted_password || "";
      syncCheckbox.checked = userDataAtIndex.sync || false;
      //devCheckbox.checked = !userDataAtIndex.sync || false;
      customTextField.value = userDataAtIndex.notes || "";
      domainfield.value = domain;
    }
  }

  // Listen for messages from the background script
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

  // Fetch user data from storage and update the popup
  chrome.storage.local.get("userData", function (result) {
    const userData = result.userData;
    updatePopup(userData);
  });
});

// Function to handle the "Update" button click
// Function to handle the "Update" button click
async function updateData() {
  // Extract the index from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get("index");

  // Fetch user data from storage
  chrome.storage.local.get("userData", async function (result) {
    const userData = result.userData;

    // Use the index to access the corresponding user data
    if (Array.isArray(userData) && userData.length > index) {
      const userDataAtIndex = userData[index];

      // Extract the ID from the fetched data
      const userId = userDataAtIndex.id;
      console.log("Updating data for user ID:", userId);
      // Extract the values from the form fields
      var response = await fetch("http://127.0.0.1:8000/auth/master", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      var password=document.getElementById("passwordField").value;
      var data = await response.json();
      const hashedMasterPassword = data.hashedMasterPassword;
      const salt = data.salt;
      const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, { keySize: 256 / 32, iterations: 10000 });
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
          vault: userDataAtIndex.domain.vault
        }
      };
      console.log(JSON.stringify(updatedData));
      console.log("Fetch URL:", `http://127.0.0.1:8000/${userId}/update/`);
      // Make an HTTP request to update the data
      fetch(`http://127.0.0.1:8000/${userId}/update/`, {
        // Concatenate userId
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  });
}
