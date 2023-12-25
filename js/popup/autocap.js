const togglePasswordClosed = document.getElementById('togglePasswordVisibilityClosed');
const togglePasswordOpen = document.getElementById('togglePasswordVisibilityOpen');
const passwordField = document.getElementById('passwordField');

togglePasswordClosed.addEventListener('click', function () {
    passwordField.type = 'text';
    togglePasswordClosed.style.display = 'none';
    togglePasswordOpen.style.display = 'inline';
});

togglePasswordOpen.addEventListener('click', function () {
    passwordField.type = 'password';
    togglePasswordOpen.style.display = 'none';
    togglePasswordClosed.style.display = 'inline';
});

const cancelButton = document.getElementById('cancelButton');


cancelButton.addEventListener('click', () => {
    document.querySelector('.popup-container').style.display = 'none';
    close('.popup');
});
