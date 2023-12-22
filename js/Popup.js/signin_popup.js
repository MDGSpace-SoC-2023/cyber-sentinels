const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
    window.location.href = 'popup.html';
});

//Signin API Implementation.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form.login');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const userData = {
            username: formData.get('username'),
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

            if (responseData.valid) {
                window.location.href = 'basic.html';
            } else {
                alert('Invalid username or password. Please try again.');
            }
        } catch (error) {
            // Handle fetch or network-related errors
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
