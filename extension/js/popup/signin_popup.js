$(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();

    var username = $("#login__username").val();
    var password = $("#login__password").val();
    os = getOs();
    browser = getBrowser();
    authenticateUserAPI(username, password, true, browser, os)
      .then(function (response) {
        if (response && response.token) {
          localStorage.setItem("token", response.token);
          window.location.href = "basic.html";
        } else {
          alert("Invalid username or password. Please try again.");
        }
      })
      .catch(function (error) {
        console.error("API Error:", error);
        alert("Error during authentication. Please try again.");
      });
  });
});

function authenticateUserAPI(username, password, loginType, browser, os) {
  var csrfEndpoint = "http://127.0.0.1:8000/auth/csrf/";
  var apiEndpoint = "http://127.0.0.1:8000/auth/login/";

  return fetch(csrfEndpoint, {
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
      var csrfToken = data.csrf;

      return fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ username, password, loginType, os, browser }),
      });
    })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("API Fetch Error:", error);
    });
}

const backButton = document.getElementById("Backbtn");

backButton.addEventListener("click", () => {
  window.location.href = "popup.html";
});

function getBrowser() {
  return platform.name.toString();
}

function getOs() {
  return platform.os.toString();
}
