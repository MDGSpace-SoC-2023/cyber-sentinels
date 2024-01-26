const token = localStorage.getItem("token");

var popupUrl = token
  ? "../../templates/popup/basic.html"
  : "../../templates/popup/popup.html";

console.log("popupUrl:", popupUrl);
fetch(chrome.runtime.getURL(popupUrl))
  .then((response) => response.text())
  .then((html) => {
    document.body.innerHTML = html;

    if (document.body) {
      if (popupUrl === "../../templates/popup/basic.html") {
        loadScript("../../js/popup/basic.js");
      } else if (popupUrl === "../../templates/popup/autocap.html") {
        loadScript("../../js/popup/autocap.js");
      } else {
        loadScript("../../js/popup/popup.js");
      }

      configurePopupActions();
    } else {
      console.error("Error: Body element not found in the loaded content.");
    }
  })
  .catch((error) => console.error("Error loading popup content:", error));

function loadScript(scriptSrc) {
  const script = document.createElement("script");
  script.src = scriptSrc;
  document.head.appendChild(script);
}

function configurePopupActions() {
  const passwordGeneratorBtn = document.getElementById("passwordGeneratorBtn");
  const signInBtn = document.getElementById("signInBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (passwordGeneratorBtn) {
    passwordGeneratorBtn.addEventListener("click", () => {
      fetch("genpass.html")
        .then((response) => response.text())
        .then((html) => {
          document.body.innerHTML = html;
          loadScript("../../js/popup/genpass.js");
        })
        .catch((error) => {
          console.error("Error fetching genpass.html:", error);
        });
    });
  }

  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      fetch("signin_popup.html")
        .then((response) => response.text())
        .then((html) => {
          document.body.innerHTML = html;
          loadScript("../../js/popup/jquery.js");
          loadScript("../../js/popup/signin_popup.js");
        })
        .catch((error) => {
          console.error("Error fetching signin_popup.html:", error);
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("token");
      window.location.href = "../../templates/popup/basic.html";
    });
  }
}

chrome.runtime.sendMessage({ token: token });
