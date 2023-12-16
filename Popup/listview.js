const eyeButtons = document.querySelectorAll('.eye-icon');
const editButtons = document.querySelectorAll('.edit-icon');

function openEyeFile() {
  window.location.href = 'eye.html';
}

function openEditFile() {
  window.location.href = 'edit.html';
}

eyeButtons.forEach(btn => {
  btn.addEventListener('click', openEyeFile);
});

editButtons.forEach(btn => {
  btn.addEventListener('click', openEditFile);
});

window.onload = function () {
  let addCredentialsButton = document.querySelector(".add-credentials-button");

  addCredentialsButton.addEventListener("click", function () {
    window.location.href = "addcred.html";
  });
};
