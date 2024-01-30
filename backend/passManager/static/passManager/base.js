async function verifyToken() {
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
    var response = await fetch('http://127.0.0.1:8000/auth/verify/', payload);
    var data = await response.json();
    console.log('Verification result:', data);
    return data.result;
}

async function verifyAndLogout() {
    var result = await verifyToken()
    if (!result) {
        document.getElementById('hidden-logout-button').click();
    }
}


verifyAndLogout();