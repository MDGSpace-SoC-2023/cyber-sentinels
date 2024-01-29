function openEyeFile(event) {
  const parentButton = event.currentTarget.closest("button");
  var domname = document.getElementsByClassName("domain-name")[0].textContent;
  if (parentButton) {
    const index = parentButton.getAttribute("data-index");
    window.location.href = `eye.html?index=${index}&domain=${domname}`;
  }
}
function sendMessageToContentScript() {
  chrome.runtime.sendMessage({ type: "hey" });
}

const token = localStorage.getItem("token");
chrome.runtime.sendMessage({ token: token });

function updateDomainName() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetDomain = urlParams.get("target_domain");
  var domname = document.getElementsByClassName("domain-name")[0];
  domname.textContent = targetDomain;
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
    button.className = "dummy-button";
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
    var idele = document.createElement("p");
    idele.textContent = element.id;
    idele.style.display = "none";
    iconsDiv.appendChild(visibilityIcon);
    iconsDiv.appendChild(editIcon);
    button.appendChild(idele);
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

const urlParams = new URLSearchParams(window.location.search);
const targetDomain = urlParams.get("target_domain");
async function fetchDataFromBackend(targetDomain) {
  var backendUrl = `http://127.0.0.1:8000/view?target_domain=${targetDomain}`;
  const response = await fetch(backendUrl);
  const data = await response.json();
  updateDomainName();
  updatePopup(data);
  autofillCreds(data);
  chrome.storage.local.set({ userData: data }, function () {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    }
  });
}
fetchDataFromBackend(targetDomain);

function autofillCreds(data) {
  var btns = document.querySelectorAll(".dummy-button");

  for (const btn of btns) {
    btn.addEventListener("click", async function () {
      var index = btn.getAttribute("data-index");
      var response = await fetch("http://127.0.0.1:8000/auth/master", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      var data1 = await response.json();
      const hashedMasterPassword = data1.hashedMasterPassword;
      const salt = data1.salt;
      const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, {
        keySize: 256 / 32,
        iterations: 10000,
      });
      const secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
      var decryptedBytes = CryptoJS.AES.decrypt(
        data[index].encrypted_password,
        secretKey
      );
      var decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      chrome.runtime.sendMessage({
        action: "autofillCreds",
        index: index,
        username: data[index].username,
        password: decryptedData,
      });
    });
  }
}
