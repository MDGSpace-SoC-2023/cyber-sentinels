
const passwordGeneratorBtn = document.getElementById('passwordGeneratorBtn');


passwordGeneratorBtn.addEventListener('click', () => {

    fetch('genpass.html')
        .then(response => response.text())
        .then(html => {

            document.body.innerHTML = html;


            const script = document.createElement('script');
            script.src = 'genpass.js';
            document.head.appendChild(script);
        })
        .catch(error => {
            console.error('Error fetching genpass.html:', error);
        });
});

const signInBtn = document.getElementById('signInBtn');

signInBtn.addEventListener('click', () => {
    fetch('signin_popup.html')
        .then(response => response.text())
        .then(html => {
            document.body.innerHTML = html;




        })
        .catch(error => {
            console.error('Error fetching signin_popup.html:', error);
        });
});

