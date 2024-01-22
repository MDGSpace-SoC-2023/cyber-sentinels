// chrome.storage.local.get(['token'], function(result) {
//     if (result.token) {
//       console.log('Token found:', result.token);
//       const popupUrl = token ? "abc.html" : "xyz.html";
//       chrome.runtime.sendMessage({ popupUrl });
//       // Use the token here
//     } else {
//       console.log('Token not found in localStorage');
//     }
//   });


console.log("Hello from bs.js");


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.token) {
        chrome.storage.local.set({ 'token': message.token }, function() {
            console.log('Token synchronized to Chrome\'s local storage.');
        });
  
        fetchData(message.token, sendResponse);
  
        return true;
    }
  });
  
  function fetchData(token, sendResponse) {
    const backendUrl = 'http://127.0.0.1:8000/view/?target_domain=www.google.com';
  
    fetch(backendUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
    })
        .then(response => response.json())
        .then(userData => {
            console.log('Data fetched:', userData);
  
            // Store the fetched data in Chrome storage
            chrome.storage.local.set({ 'userData': userData }, function() {
                console.log('User data stored in Chrome storage.');
            });
  
            // Send a message to all popups
            chrome.runtime.sendMessage({ userData: userData });
  
            sendResponse('Data fetched successfully.');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            sendResponse(null);
        });
  }
  