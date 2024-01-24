const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

function get_action(form) {
  var response = grecaptcha.getResponse();
  if (response.length === 0) {
    document.getElementById('captchaError').textContent = "Please verify the reCAPTCHA.";
    return false;
  } else {
    document.getElementById('captchaError').textContent = "";
    return true;
  }
}


signUpButton.addEventListener("click", () => {
  clearRegisterFormMessages();
  clearLoginFormMessages();
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  clearRegisterFormMessages();
  clearLoginFormMessages();
  container.classList.remove("right-panel-active");
});

function clearRegisterFormMessages() {
  const errorlistRegister = document.getElementById('errorlistRegister');
  errorlistRegister.innerHTML = '';

  const inputs = ['first_name', 'username', 'email', 'password1', 'password2'];
  inputs.forEach(inputId => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.classList.remove('error');
    }
  });

  const messagecontainerRegister = document.getElementById('messagecontainerRegister');
  if (messagecontainerRegister) {
    messagecontainerRegister.innerHTML = '';
  }
}

function registerUser(event) {
  event.preventDefault();
  const csrfToken = document.querySelector("div.form-container.sign-up-container input[name='csrfmiddlewaretoken']").value;
  const first_name = document.getElementById('first_name').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password1').value;
  const confirmPassword = document.getElementById('password2').value;
  const messagecontainerRegister = document.getElementById('messagecontainerRegister');
  const errorlistRegister = document.getElementById('errorlistRegister');

  if (password != confirmPassword) {
    clearRegisterFormMessages();
    document.getElementById('password1').classList.add('error');
    document.getElementById('password2').classList.add('error');
    const listItem = document.createElement('li');
    listItem.textContent = 'Passwords are not matching';
    errorlistRegister.appendChild(listItem);
    console.error('Passwords are not matching')
    return;
  }

  if (!first_name || !username || !email || !password || !confirmPassword) {
    clearRegisterFormMessages();
    if (!first_name) {
      document.getElementById('first_name').classList.add('error');
    }
    if (!username) {
      document.getElementById('username').classList.add('error');
    }
    if (!email) {
      document.getElementById('email').classList.add('error');
    }
    if (!password) {
      document.getElementById('password1').classList.add('error');
    }
    if (!confirmPassword) {
      document.getElementById('password2').classList.add('error');
    }
    const listItem = document.createElement('li');
    listItem.textContent = 'All fields must be filled in.';
    errorlistRegister.appendChild(listItem);
    console.error('All fields must be filled in.');
    return;
  }

  fetch('http://127.0.0.1:8000/auth/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({
      first_name: first_name,
      username: username,
      email: email,
      password: password,
    }),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errors => {
          throw new Error(JSON.stringify(errors));
        });
      }
      return response.json();
    })
    .then(response => {
      console.log('Registration Initiated:', response);
      clearRegisterFormMessages();
      const successMessage = document.createElement('span');
      successMessage.textContent = 'Registration Successful!, Please Login';
      successMessage.style.color = 'green';
      messagecontainerRegister.appendChild(successMessage);
    })
    .catch(error => {
      console.error('Registration failed:', error);
      clearRegisterFormMessages();
      if (error.message && typeof error.message === 'string') {
        const errors = JSON.parse(error.message);
        const errorlistRegister = document.getElementById('errorlistRegister');
        errorlistRegister.innerHTML = '';

        if (errors.username) {
          document.getElementById('username').classList.add('error');
          errors.username.forEach(error => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            errorlistRegister.appendChild(listItem);
          });
        }
        if (errors.email) {
          document.getElementById('email').classList.add('error');
          errors.email.forEach(error => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            errorlistRegister.appendChild(listItem);
          });
        }
        else if (errors.password) {
          document.getElementById('password1').classList.add('error');
          document.getElementById('password2').classList.add('error');
          errors.password.forEach(error => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            errorlistRegister.appendChild(listItem);
          });
        }
      }
    });
}
document.getElementById('registerForm').addEventListener('submit', registerUser);


function clearLoginFormMessages() {
  const errorlistRegister = document.getElementById('errorlistLogin');
  errorlistLogin.innerHTML = '';
  errorlistRegister.innerHTML = '';
  const inputs = ['user', 'passwordField'];
  inputs.forEach(inputId => {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.classList.remove('error');
    }
  });
}

function loginUser(event) {
  clearLoginFormMessages();
  event.preventDefault();
  const csrfToken = document.querySelector("div.form-container.sign-in-container input[name='csrfmiddlewaretoken']").value;
  const username = document.getElementById('user').value;
  const password = document.getElementById('passwordField').value;
  const errorlistLogin = document.getElementById('errorlistLogin');

  const recaptchaResponse = grecaptcha.getResponse();
  if (recaptchaResponse.length === 0) {
    document.getElementById('captchaError').textContent = "Please verify the reCAPTCHA.";
    return;
  }

  if (!username || !password) {
    clearLoginFormMessages();
    if (!username) {
      document.getElementById('user').classList.add('error');
    }
    if (!password) {
      document.getElementById('passwordField').classList.add('error');
    }
    const listItem = document.createElement('li');
    listItem.textContent = 'All fields must be filled in.';
    errorlistLogin.appendChild(listItem);
    console.error('All fields must be filled in.');
    return;
  }

  fetch('http://127.0.0.1:8000/auth/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({
      username: username,
      password: password,
      recaptcha_response: recaptchaResponse,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      return response.json();
    })
    .then(response => {
      localStorage.setItem('token', response.token)
      window.location.href = "http://127.0.0.1:8000/";
      console.log('Login Initiated:', response);
    })
    .catch(error => {
      clearLoginFormMessages();
      console.error('Login failed:', error);
      document.getElementById('user').classList.add('error');
      document.getElementById('passwordField').classList.add('error');
      const listItem = document.createElement('li');
      listItem.textContent = error.message;
      errorlistLogin.appendChild(listItem);

      console.log('Error:', error);
    });
}


document.getElementById('loginForm').addEventListener('submit', loginUser);
