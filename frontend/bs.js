importScripts("crypto-js.min.js");

console.log("Hello from bs.js");
var targetDomain;
var backendUrl;
var token = null;
chrome.storage.local.get("token", function (data) {
  console.log(data);
  token = data.token;
  console.log("Token:", token);
});
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (
    message.source === "contentScript" &&
    message.action === "tabUrlFetched"
  ) {
    console.log("tabUrlFetched");
    console.log("Received tab URL:", message.url);
    targetDomain = extractValueFromUrl(message.url);
    console.log("Target domain:", targetDomain);
    backendUrl = `http://127.0.0.1:8000/view?target_domain=${targetDomain}`;

    const backendData = await fetchDataFromBackend();
    if (backendData.length !== 0) {
      chrome.tabs.sendMessage(sender.tab.id, {
        source: "backgroundScript",
        action: "backendDataFetched",
        data: backendData,
      });
    }
  }

  if (message.token) {
    chrome.storage.local.set({ token: message.token }, function () {});

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

    const backendData = await fetchDataFromBackend();
    console.log("backendData:", backendData);
    if (backendData.length != 0) {
      backendData.forEach((data) => {
        console.log("data:", data);
        if (data.username == storedCredentials.username) {
          if (data.password != storedCredentials.password) {
            console.log("Password mismatch");
            var password_id = data.id;
            updatePassword(
              data.username,
              storedCredentials.password,
              targetDomain,
              password_id
            );
            // chrome.runtime.sendMessage( {
            //   action: "openPop", source: "background.js"
            // });
            return;
          }
          console.log("data.password:", data.password);
        } else {
          createPassword(
            storedCredentials.username,
            storedCredentials.password,
            targetDomain
          );
        }
      });
    }

    function updatePassword(username, password, domain, id) {
      var updateId = id;

      fetch("http://127.0.0.1:8000/auth/master", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
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
          console.log("username:", username);
          console.log("domain:", domain);
          console.log("encryptedData:", encryptedData);
          fetch(`http://127.0.0.1:8000/${updateId}/update/`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
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
            .catch((error) => console.log(error));
        })
        .catch((error) => console.error("Error:", error));
    }

    function createPassword(username, password, domain) {
      fetch("http://127.0.0.1:8000/auth/master", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
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
              console.log("Password encryption completed");
              console.log(response);
              if (!response.ok) {
                return response.json().then((errors) => {
                  throw new Error(JSON.stringify(errors));
                });
              }
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.error("Error:", error));
    }

    chrome.storage.local.set(
      { storedCredentials: storedCredentials },
      function () {
        console.log("Credentials stored:", storedCredentials);
      }
    );
  }
}
