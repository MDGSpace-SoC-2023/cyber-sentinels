const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
    window.location.href = 'listview.html';
});

const donebtn = document.getElementById('done');

donebtn.addEventListener('click', () => {
    document.querySelector('.popup').style.display = 'none';
    close('.popup');
});

const token = localStorage.getItem('token');
chrome.runtime.sendMessage({ token: token });
document.addEventListener('DOMContentLoaded', function () {
    // Function to update the popup with user data
    function updatePopup(userData) {
      console.log('Received userData:', userData);
  
      // Extract the index from the query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const index = urlParams.get('index');
      const domain=urlParams.get('domain');
      const domainfield=document.getElementById('domain');
      const usernameField = document.getElementById('username');
      const passwordField = document.getElementById('passwordField');
      const syncCheckbox = document.getElementById('sync');
      const customTextField = document.getElementById('customText');
      // Use the index to access the corresponding user data
      if (Array.isArray(userData) && userData.length > index) {
        const userDataAtIndex = userData[index];
        usernameField.value = userDataAtIndex.username || '';
        passwordField.value = userDataAtIndex.encrypted_password || '';
        syncCheckbox.checked = userDataAtIndex.sync || false;
        customTextField.value = userDataAtIndex.notes || '';
        domainfield.value=domain;
      }
    }
  
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.userData) {
        const userData = message.userData;
        updatePopup(userData);
      }
    });
  
    // Fetch user data from storage and update the popup
    chrome.storage.local.get('userData', function (result) {
      const userData = result.userData;
      updatePopup(userData);
    });
  });
  
