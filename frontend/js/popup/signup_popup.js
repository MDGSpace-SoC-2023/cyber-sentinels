const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
  window.location.href = "popup.html";
});

// Signup API Implementation.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  
  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const userData = {
          name: formData.get('name'),
          username: formData.get('username'),
          email: formData.get('email'),
          password: formData.get('password')
      };
      
      try {
          const response = await fetch('https://your-api-endpoint.com/validate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  // Add any other necessary headers for authentication or security tokens
              },
              body: JSON.stringify(userData)
          });

          if (!response.ok) {
              throw new Error('Network response was not ok.');
          }

          // Parse the API response
          const responseData = await response.json();

          // Check the validation status returned from the API
          if (responseData.valid) {
              // User details are valid
              // Redirect to a success page or perform further actions
              window.location.href = 'basic.html';
          } else {
              // Handle invalid user details
              // Display error message or take appropriate action
              alert('Invalid user details. Please check and try again.');
          }
      } catch (error) {
          // Handle fetch or network-related errors
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
      }
  });
});
