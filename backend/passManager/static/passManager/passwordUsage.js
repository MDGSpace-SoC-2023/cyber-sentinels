const showBtn = document.querySelectorAll(".editbtn");
const modalBox = document.querySelector(".modal-box");
const overlay = document.querySelector(".overlay");
const cancelButton = document.querySelector("#cancelButton");

// Function to show the modal box and overlay
function showModal() {
    modalBox.style.display = "block";
    overlay.style.display = "block";
}

// Function to hide the modal box and overlay
function hideModal() {
    modalBox.style.display = "none";
    overlay.style.display = "none";
}

showBtn.forEach(btn => {
    btn.addEventListener("click", showModal);
});

overlay.addEventListener("click", hideModal);
cancelButton.addEventListener("click", hideModal);

/**
 * Parse a password string into a numeric value.
 * This function evaluates password strength based on various criteria.
 *
 * @param {string} password - The password string to evaluate.
 * @return {number} - Numeric score representing the password strength.
 */
let evaluatePassword = (password) => {
    let score = 0;
    score += password.length;
    const specialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g;
    if (password.match(specialChars)) {
        score += password.match(specialChars).length * 3;
    }
    if (password.match(/[A-Z]/)) {
        score += 3;
    }
    if (password.match(/[0-9]/)) {
        score += 3;
    }
    return score;
};
/**
 * Convert a numeric score into an object of 'password strength' data.
 * This function translates the score into a qualitative strength level.
 *
 * @param {number} score - The numeric score representing password strength.
 * @return {Object} - Object containing color and label representing password strength.
 */
let scoreToData = (score) => {
    if (score >= 30) {
        return {
            color: '#26de81',
            label: 'Strong'
        };
    } else if (score >= 10) {
        return {
            color: '#f7b731',
            label: 'Moderate'
        };
    } else {
        return {
            color: '#fc5c65',
            label: 'Weak'
        };
    }
};
window.addEventListener('DOMContentLoaded', () => {
    let passwords = document.querySelectorAll('.passwords');
    let colorBoxes = document.querySelectorAll('.color-boxes');
    passwords.forEach((passwordElement, index) => {
        let data = scoreToData(evaluatePassword(passwordElement.value));
        colorBoxes[index].style.background = data.color;
        let tooltipText = passwordElement.parentElement.querySelector('.tooltiptext');
        if (tooltipText) {
            tooltipText.innerHTML = data.label;
        }
    });
    let domains = document.querySelectorAll('.filterDiv');
    let colorboxfordomain = document.querySelectorAll('.color-box');
    domains.forEach((domain, index) => {
        var content = domain.nextElementSibling;
        var i = 0;
        var score = 0;
        if (content.classList.contains("content")) {
            while (content && !content.classList.contains("filterDiv")) {
                let passwordElement = content.querySelector('.passwords');
                if (passwordElement) {
                    score = score + evaluatePassword(passwordElement.value);
                    i++;
                }
                content = content.nextElementSibling;
            }
        }
        score = score / i;
        let data = scoreToData(score);
        colorboxfordomain[index].style.background = data.color;
        let tooltipText = domain.querySelector(".tooltiptext");
        if (tooltipText) {
            tooltipText.innerHTML = data.label;
        }
    });
});
var collapsibles = document.getElementsByClassName("Arrow");
collapsibles[0].addEventListener("click", function () {
    var menu = document.getElementsByClassName("Menu")[0];
    menu.classList.toggle("hidden");
    var mainSection = document.getElementsByClassName("Main")[0];
    mainSection.classList.toggle("full-width", menu.classList.contains("hidden"));
    var Heading = document.getElementsByClassName("heading")[0];
    var arrow = document.getElementsByClassName("Arrow")[0];
    if (menu.classList.contains('hidden')) {
        arrow.innerHTML = "&#707;";
        Heading.style.left = "2%";
    } else {
        arrow.innerHTML = "&#706;";
        Heading.style.left = "22%";
    }
});

var coll = document.getElementsByClassName("filterDiv");
function contentOpenNclose(filterDiv) {
    var content = filterDiv.nextElementSibling;
    if (content.classList.contains("content")) {
        while (content && !content.classList.contains("filterDiv")) {
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
            content = content.nextElementSibling;
        }
    }
    filterDiv.classList.toggle("altContent");
}
for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        var content = this.nextElementSibling;
        if (content.classList.contains("content")) {
            while (content && !content.classList.contains("filterDiv")) {
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
                content = content.nextElementSibling;
            }
        }
        this.classList.toggle("altContent");
    });
}

function Showpassword(eyeicon) {
    var passwrd = eyeicon.previousElementSibling;
    if (passwrd.getAttribute('type') === 'password') {
        passwrd.setAttribute('type', 'text');
    } else {
        passwrd.setAttribute('type', 'password');
    }
}
var eyeicons = document.getElementsByClassName("eyeicon");
for (var i = 0; i < eyeicons.length; i++) {
    eyeicons[i].addEventListener("click", function () {
        var passwrd = this.previousElementSibling;
        if (passwrd.getAttribute('type') === 'password') {
            passwrd.setAttribute('type', 'text');
            this.innerHTML = `
            <path d="M2 2L22 22" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `;
        } else {
            passwrd.setAttribute('type', 'password');
            this.innerHTML = `
            <g stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m15.0007 12c0 1.6569-1.3431 3-3 3-1.6568 0-2.99997-1.3431-2.99997-3s1.34317-3 2.99997-3c1.6569 0 3 1.3431 3 3z"/><path d="m12.0012 5c-4.47766 0-8.26794 2.94288-9.54222 7 1.27426 4.0571 5.06456 7 9.54222 7 4.4776 0 8.2679-2.9429 9.5422-7-1.2743-4.05709-5.0646-7-9.5422-7z"/></g>
            `;
        }
    });
}
var account = document.getElementById("Account");
account.addEventListener("click", function () {
    var accountOptions = document.getElementsByClassName("accnt");
    for (var i = 0; i < accountOptions.length; i++) {
        var cmptdStyle = window.getComputedStyle(accountOptions[i]);
        if (cmptdStyle.display === "none" || cmptdStyle.getPropertyValue('display') === 'none') {
            accountOptions[i].style.display = "block";
        } else {
            accountOptions[i].style.display = "none";
        }
    }
});