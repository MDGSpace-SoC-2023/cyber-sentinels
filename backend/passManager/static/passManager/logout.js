async function logout(event) {
    event.preventDefault();

    var token = localStorage.getItem('token');
    const logoutform = document.querySelector(".logout");
    const csrfToken = logoutform.querySelector("form.logoutform input[name='csrfmiddlewaretoken']").value;
    try {
        var response = await fetch('http://127.0.0.1:8000/auth/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Token ${token}`,
            },
        });
        if (!response.ok) {
            localStorage.removeItem('token');
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        var data = response.json();
        console.log('Logout successful:', data);
        window.location.href = 'http://127.0.0.1:8000/auth';
    } catch (error) {
        console.log("Error:", error);
    }
    // fetch('http://127.0.0.1:8000/auth/logout/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': csrfToken,
    //         'Authorization': `Token ${token}`,
    //     },
    // })
    //     .then(response => {
    //     if (!response.ok) {
    //         localStorage.removeItem('token');
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     return response.json();
    // })
    //     .then(data => {
    //     console.log('Logout successful:', data);
    //     window.location.href = 'http://127.0.0.1:8000/auth';
    // })
    //     .catch(error => {
    //         console.error('Logout failed:', error);
    //     });
}