$(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();

    var username = $("#login__username").val();
    var password = $("#login__password").val();

    authenticateUserAPI(username, password)
      .then(function (response) {
        console.log("API Response:", response);

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

function authenticateUserAPI(username, password) {
  var apiEndpoint = "http://127.0.01:8000/auth/login/";

  return fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      console.log("HTTP Status Code:", response.status);
      return response.json();
    })
    .then((response) => {
      console.log("API Response:", response);
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
