document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    const popupUrl = token ? "../../templates/popup/basic.html" : "../../templates/popup/popup.html";
  
    fetch(chrome.runtime.getURL(popupUrl))
      .then(response => response.text())
      .then(html => {
        document.body.innerHTML = html;
  
        // Check if the content has been successfully loaded
        if (document.body) {
          // Load scripts based on the popup type
          if (popupUrl === "../../templates/popup/basic.html") {
            loadScript("../../js/popup/basic.js");
          } else {
            loadScript("../../js/popup/popup.js");
          }
  
          // Add event listeners or perform additional actions if needed
          configurePopupActions();
        } else {
          console.error('Error: Body element not found in the loaded content.');
        }
      })
      .catch(error => console.error('Error loading popup content:', error));
  });
  
  function loadScript(scriptSrc) {
    const script = document.createElement('script');
    script.src = scriptSrc;
    document.head.appendChild(script);
  }
  
  function configurePopupActions() {
    const passwordGeneratorBtn = document.getElementById('passwordGeneratorBtn');
    const signInBtn = document.getElementById('signInBtn');
    const logoutBtn = document.getElementById('logoutBtn');
  
    // Check if the elements exist before attaching event listeners
    if (passwordGeneratorBtn) {
      passwordGeneratorBtn.addEventListener('click', () => {
        // Handle the click for the password generator button
        fetch('genpass.html')
          .then(response => response.text())
          .then(html => {
            document.body.innerHTML = html;
            loadScript('../../js/popup/genpass.js');
          })
          .catch(error => {
            console.error('Error fetching genpass.html:', error);
          });
      });
    }
  
    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        // Handle the click for the sign-in button
        fetch('signin_popup.html')
          .then(response => response.text())
          .then(html => {
            document.body.innerHTML = html;
            loadScript('../../js/popup/jquery.js');
            loadScript('../../js/popup/signin_popup.js');
          })
          .catch(error => {
            console.error('Error fetching signin_popup.html:', error);
          });
      });
    }
  
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('token');
        window.location.href = '../../templates/popup/basic.html';
      });
    }
  }
  
  const token = localStorage.getItem('token');
  chrome.runtime.sendMessage({ token: token });