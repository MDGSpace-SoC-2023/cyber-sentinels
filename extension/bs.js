importScripts("crypto-js.min.js");

const FORM_MARKERS = [
  "login",
  "log-in",
  "log_in",
  "signin",
  "sign-in",
  "sign_in",
];
const OPENID_FIELDS = {
  selectors: [
    "input[name*=openid i]",
    "input[id*=openid i]",
    "input[class*=openid i]",
  ],
  types: ["text"],
};
const USERNAME_FIELDS = {
  selectors: [
    "input[autocomplete=username i]",
    "input[name=login i]",
    "input[name=user i]",
    "input[name=username i]",
    "input[name=username]",
    "input[name=email i]",
    "input[name=alias i]",
    "input[id=login i]",
    "input[id=user i]",
    "input[id=username i]",
    "input[id=email i]",
    "input[id=alias i]",
    "input[class=login i]",
    "input[class=user i]",
    "input[class=username i]",
    "input[class=email i]",
    "input[class=alias i]",
    "input[name*=login i]",
    "input[name*=user i]",
    "input[name*=email i]",
    "input[name*=alias i]",
    "input[id*=login i]",
    "input[id*=user i]",
    "input[id*=email i]",
    "input[id*=alias i]",
    "input[class*=login i]",
    "input[class*=user i]",
    "input[class*=email i]",
    "input[class*=alias i]",
    "input[type=email i]",
    "input[autocomplete=email i]",
    "input[type=tel i]",
    "input[name*=phonenumber i]",
    "input[id*=phonenumber i]",
    "input[class*=phonenumber i]",
  ],
  types: ["username", "email", "tel"],
};
const PASSWORD_FIELDS = {
  selectors: [
    "input[type=password i][autocomplete=current-password i]",
    "input[type=password i]",
    "input[name*=password i]",
    "input[id*=password i]",
    "input[name*=pass i]",
    "input[id*=pass i]",
    "input[class*=pass i]",
    "input[class*=password i]",
  ],
};
const INPUT_FIELDS = {
  selectors: PASSWORD_FIELDS.selectors
    .concat(USERNAME_FIELDS.selectors)
    .concat(OPENID_FIELDS.selectors),
};
const SUBMIT_FIELDS = {
  selectors: [
    "[type=submit i]",
    "button[name=login i]",
    "button[name=log-in i]",
    "button[name=log_in i]",
    "button[name=signin i]",
    "button[name=sign-in i]",
    "button[name=sign_in i]",
    "button[id=login i]",
    "button[id=log-in i]",
    "button[id=log_in i]",
    "button[id=signin i]",
    "button[id=sign-in i]",
    "button[id=sign_in i]",
    "button[class=login i]",
    "button[class=log-in i]",
    "button[class=log_in i]",
    "button[class=signin i]",
    "button[class=sign-in i]",
    "button[class=sign_in i]",
    "input[type=button i][name=login i]",
    "input[type=button i][name=log-in i]",
    "input[type=button i][name=log_in i]",
    "input[type=button i][name=signin i]",
    "input[type=button i][name=sign-in i]",
    "input[type=button i][name=sign_in i]",
    "input[type=button i][id=login i]",
    "input[type=button i][id=log-in i]",
    "input[type=button i][id=log_in i]",
    "input[type=button i][id=signin i]",
    "input[type=button i][id=sign-in i]",
    "input[type=button i][id=sign_in i]",
    "input[type=button i][class=login i]",
    "input[type=button i][class=log-in i]",
    "input[type=button i][class=log_in i]",
    "input[type=button i][class=signin i]",
    "input[type=button i][class=sign-in i]",
    "input[type=button i][class=sign_in i]",
    "button[name*=login i]",
    "button[name*=log-in i]",
    "button[name*=log_in i]",
    "button[name*=signin i]",
    "button[name*=sign-in i]",
    "button[name*=sign_in i]",
    "button[id*=login i]",
    "button[id*=log-in i]",
    "button[id*=log_in i]",
    "button[id*=signin i]",
    "button[id*=sign-in i]",
    "button[id*=sign_in i]",
    "button[class*=login i]",
    "button[class*=log-in i]",
    "button[class*=log_in i]",
    "button[class*=signin i]",
    "button[class*=sign-in i]",
    "button[class*=sign_in i]",
    "input[type=button i][name*=login i]",
    "input[type=button i][name*=log-in i]",
    "input[type=button i][name*=log_in i]",
    "input[type=button i][name*=signin i]",
    "input[type=button i][name*=sign-in i]",
    "input[type=button i][name*=sign_in i]",
    "input[type=button i][id*=login i]",
    "input[type=button i][id*=log-in i]",
    "input[type=button i][id*=log_in i]",
    "input[type=button i][id*=signin i]",
    "input[type=button i][id*=sign-in i]",
    "input[type=button i][id*=sign_in i]",
    "input[type=button i][class*=login i]",
    "input[type=button i][class*=log-in i]",
    "input[type=button i][class*=log_in i]",
    "input[type=button i][class*=signin i]",
    "input[type=button i][class*=sign-in i]",
    "input[type=button i][class*=sign_in i]",
  ],
};

var targetDomain;
var token = null;
chrome.storage.local.get("token", function (data) {
  token = data.token;
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (
    message.source === "contentScript" &&
    message.action === "tabUrlFetched"
  ) {
    targetDomain = extractValueFromUrl(message.url);
    backendUrl = `http://127.0.0.1:8000/view?target_domain=${targetDomain}`;
    const hasPasswordFields = message.hasPasswordFields;
    if (
      message.url.includes("login") ||
      message.url.includes("signin") ||
      message.url.includes("signup") ||
      message.url.includes("register") ||
      hasPasswordFields
    ) {
      chrome.action.setPopup({
        popup: `../../templates/popup/listview.html?target_domain=${targetDomain}`,
      });
    } else {
      chrome.action.setPopup({ popup: "../../templates/popup/popup.html" });
    }

    const backendData = await fetchDataFromBackend();
  }
  if (message.action === "autofillCreds" && message.source !== "bs") {
    var index = message.index;
    var username = message.username;
    var password = message.password;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: (index, username, password) => {
            function sendMessageToContentScript(index, username, password) {
              var usernameField = document.querySelector(
                USERNAME_FIELDS.selectors.join(",")
              );
              var passwordField = document.querySelector(
                PASSWORD_FIELDS.selectors.join(",")
              );
              if (usernameField && passwordField) {
                usernameField.value = username;
                passwordField.value = password;
              }
            }
            sendMessageToContentScript(index, username, password);
          },
          args: [index, username, password],
        });
      }
    });
  }

  if (message.token) {
    chrome.storage.local.set({ token: message.token }, function () { });
    return true;
  }
});

function extractValueFromUrl(url) {
  const urlObject = new URL(url);
  return urlObject.hostname;
}

async function fetchDataFromBackend() {
  const response = await fetch(backendUrl);
  const data = await response.json();
  return data;
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.runtime.onMessage.addListener(handleMessage);
});

async function handleMessage(request, sender, sendResponse) {
  if (request.type === "credentials") {
    const storedCredentials = {
      username: request.data.username,
      password: request.data.password,
    };
    var response1 = await fetch("http://127.0.0.1:8000/auth/capture/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    var data1 = await response1.json();
    console.log(data1);
    if (!data1.capture) {
      return;
    }
    try {
      backendData = await fetchDataFromBackend();

      let foundUser = false;

      backendData.forEach(async (data) => {
        if (data.username == storedCredentials.username) {
          foundUser = true;
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
            data.encrypted_password,
            secretKey
          );
          var decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
          if (decryptedData != storedCredentials.password) {
            var password_id = data.id;

            chrome.action.setPopup({
              popup: `../../templates/popup/autocap.html?target_domain=${targetDomain}&username=${data.username}&password=${storedCredentials.password}&id=${password_id}`,
            });
          }
        }
      });

      if (!foundUser) {
        createPassword(
          storedCredentials.username,
          storedCredentials.password,
          targetDomain
        );
      }

      chrome.storage.local.set(
        { storedCredentials: storedCredentials },
        function () { }
      );
    } catch (error) {
      console.error("Error fetching backend data:", error);
    }
  }
}

async function fetchDataFromBackend() {
  const response = await fetch(backendUrl);
  const data = await response.json();
  return data;
}

function updatePassword(username, password, domain, id) {
  var updateId = id;

  fetch("http://127.0.0.1:8000/auth/csrf/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
      return response.json();
    })
    .then((data) => {
      const csrfToken = data.csrf;

      fetch("http://127.0.0.1:8000/auth/master", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const hashedMasterPassword = data.hashedMasterPassword;
          const salt = data.salt;
          const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, {
            keySize: 256 / 32,
            iterations: 10000,
          });
          const secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
          var encryptedData = CryptoJS.AES.encrypt(
            password,
            secretKey
          ).toString();

          fetch(`http://127.0.0.1:8000/${updateId}/update/`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
              "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({
              username: username,
              encrypted_password: encryptedData,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then((errors) => {
                  throw new Error(JSON.stringify(errors));
                });
              }
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error("Error:", error));
    })
    .catch((error) => console.error("Error:", error));
}

function createPassword(username, password, domain) {
  fetch("http://127.0.0.1:8000/auth/csrf/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
      return response.json();
    })
    .then((data) => {
      const csrfToken = data.csrf;

      fetch("http://127.0.0.1:8000/auth/master", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const hashedMasterPassword = data.hashedMasterPassword;
          const salt = data.salt;
          const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, {
            keySize: 256 / 32,
            iterations: 10000,
          });
          const secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
          var encryptedData = CryptoJS.AES.encrypt(
            password,
            secretKey
          ).toString();
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
              sync: true,
              notes: "null",
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
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error("Error:", error));
    })
    .catch((error) => console.error("Error:", error));
}
