function verifyToken() {
    const csrfToken = document.getElementById('csrfForm').querySelector("input[name='csrfmiddlewaretoken']").value;
    const token = localStorage.getItem('token');
    console.log(token);
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            'Authorization': `Token ${token}`,
        },
    };

    return fetch('http://127.0.0.1:8000/auth/verify/', payload)
        .then(response => response.json())
        .then(data => {
            console.log('Verification result:', data);
            return data.result;
        })
        .catch(error => {
            console.error('Verification failed:', error);
            return false;
        });
}

function verifyAndLogout() {
    verifyToken()
        .then(result => {
            if (!result) {
                document.getElementById('hidden-logout-button').click();
            }
        });
}


verifyAndLogout();