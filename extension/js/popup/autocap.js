const togglePasswordClosed = document.getElementById(
  "togglePasswordVisibilityClosed"
);
const togglePasswordOpen = document.getElementById(
  "togglePasswordVisibilityOpen"
);

const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async function (event) {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const username = urlParams.get("username");
  const password = urlParams.get("password");

  const idfield = document.getElementById("idele");
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("passwordField");
  const syncCheckbox = document.getElementById("sync");
  const customTextField = document.getElementById("customText");
  idfield.textContent = id;
  usernameField.value = username;
  passwordField.value = password;
  syncCheckbox.checked = true;
  customTextField.value = "Others";
});

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

cancelButton.addEventListener("click", () => {
  document.querySelector(".popup-container").style.display = "none";
  close(".popup");
});

async function updateData() {
  const idfield = document.getElementById("idele");
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("passwordField");
  const syncCheckbox = document.getElementById("sync");
  const customTextField = document.getElementById("customText");
  const id = idfield.textContent;
  const username = usernameField.value;
  const passwrd = passwordField.value;
  const sync = syncCheckbox.checked;
  const customText = customTextField.value;
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
  var encryptedData = CryptoJS.AES.encrypt(passwrd, secretKey).toString();
  const updatedData = {
    id: id,
    sync: sync,
    encrypted_password: encryptedData,
    username: username,
    notes: customText,
  };
  var response3 = await fetch("http://127.0.0.1:8000/auth/csrf/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  var data2 = await response3.json();
  const csrfToken = data2.csrf;
  var response2 = await fetch(`http://127.0.0.1:8000/${id}/update/`, {
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

saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", async function (event) {
  event.preventDefault();
  await updateData();
  document.querySelector(".popup-container").style.display = "none";
  close(".popup");
});
