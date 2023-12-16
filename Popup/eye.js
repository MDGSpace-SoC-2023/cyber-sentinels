const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
    window.location.href = 'listview.html';
});

const donebtn = document.getElementById('done');

donebtn.addEventListener('click', () => {
    document.querySelector('.popup').style.display = 'none';
    close('.popup');
});
