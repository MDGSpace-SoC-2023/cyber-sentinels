$(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        // Retrieve username and password
        var username = $('#login__username').val();
        var password = $('#login__password').val();

        authenticateUserAPI(username, password)
            .then(function (response) {
                console.log('API Response:', response);


                if (response && response.token) {
                    // Redirect or perform actions after successful login
                    localStorage.setItem('token', response.token);
                    window.location.href = 'basic.html';

                } else {
                    alert('Invalid username or password. Please try again.');
                }
            })
            .catch(function (error) {
                console.error('API Error:', error);
                alert('Error during authentication. Please try again.');
            });

    });
});

function authenticateUserAPI(username, password) {
    var apiEndpoint = 'http://127.0.01:8000/auth/login/';

    return fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
            console.log('HTTP Status Code:', response.status);
            return response.json();
        })
        .then(response => {
            console.log('API Response:', response);
            return response;
        })
        .catch(error => {
            console.error('API Fetch Error:', error);
        });
}

// console.log("hi");

// const loginForm = document.querySelector(".form.login");

// if (!loginForm) {
//   console.error("Login form not found");
// }

// loginForm.addEventListener("submit", function (event) {
//   event.preventDefault();

//   // Collect username and password values
//   const username = document.getElementById("login__username").value;
//   const password = document.getElementById("login__password").value;

//   if (!username || !password) {
//     console.error("Username or password not found");
//     return;
//   }

//   fetch("http://127.0.0.1:8000/auth/get_csrf_token/")
//     .then((response) => response.json())
//     .then((data) => {
//       const csrfToken = data.csrf_token;
//       console.log("CSRF token:", csrfToken);

//       return fetch("http://127.0.0.1:8000/auth/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRFToken": csrfToken,
//         },
//         body: JSON.stringify({ username, password }),
//       });
//     })
//     .then((response) => {
//       console.log("Response status:", response.status);
//       return response.json();
//     })
//     .then((data) => {
//       console.log("Login successful:", data);
//       const token = data.token;

//       if (token) {
//         localStorage.setItem("token", token);
//         // Retrieve token from local storage
//         var Token = localStorage.getItem("token");

//         // Check if token is present
//         if (Token) {
//           console.log("Token found:", Token);
//         } else {
//           console.log("Token not found in local storage");
//         }
//       } else {
//         console.error("Token not found in the server response.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error during login:", error);
//     });
// });

const backButton = document.getElementById("Backbtn");

backButton.addEventListener("click", () => {
  window.location.href = "popup.html";
});