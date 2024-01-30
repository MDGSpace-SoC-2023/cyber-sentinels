const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", function () {
  logoutBtn.addEventListener("click", function () {
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
        localStorage.removeItem("token");
        const csrfToken = data.csrf;
        fetch("http:127.0.0.1:8000/auth/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Authorization: `Token ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Logout successful:", data);
            window.location.href = "../../templates/popup/popup.html";
          })
          .catch((error) => {
            console.error("Logout failed:", error);
          });
      });
  });
});

const passwordGeneratorBtn = document.getElementById("passwordGeneratorBtn");
passwordGeneratorBtn.addEventListener("click", () => {
  fetch("genpass.html")
    .then((response) => response.text())
    .then((html) => {
      document.body.innerHTML = html;
      const script = document.createElement("script");
      script.src = "genpass.js";
      document.head.appendChild(script);
    })
    .catch((error) => {
      console.error("Error fetching genpass.html:", error);
    });
});