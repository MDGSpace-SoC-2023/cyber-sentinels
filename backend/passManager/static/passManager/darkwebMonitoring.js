var collapsibles = document.getElementsByClassName("Arrow");
collapsibles[0].addEventListener("click", function () {
    var menu = document.getElementsByClassName("Menu")[0];
    menu.classList.toggle("hidden");
    var mainSection = document.getElementsByClassName("Main")[0];
    mainSection.classList.toggle("full-width", menu.classList.contains("hidden"));
    var Heading = document.getElementsByClassName("heading")[0];
    var arrow = document.getElementsByClassName("Arrow")[0];
    var head=document.getElementsByClassName("head")[0];
    if (menu.classList.contains('hidden')) {
        arrow.innerHTML = "&#707;";
        Heading.style.left = "2%";
        head.style.marginLeft="25%";
    } else {
        arrow.innerHTML = "&#706;";
        Heading.style.left = "22%";
        head.style.marginLeft="23%";
    }
});
function search_Domain() {
    var domains = document.getElementsByClassName("Domains");
    var darkwbntfctns = document.getElementsByClassName("drkwebntfcation");
    var input = document.getElementById("searchbar").value.toLowerCase();
    for (var i = 0; i < darkwbntfctns.length; i++) {
        if (domains[i].innerHTML.toLowerCase().includes(input.toLowerCase())) {
            if (darkwbntfctns[i].classList.contains("hide")) {
                darkwbntfctns[i].classList.toggle("hide");
            }
        } else {
            if (!darkwbntfctns[i].classList.contains("hide")) {
                darkwbntfctns[i].classList.toggle("hide");
            }
        }
    }
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

async function checkPassword(password) {
    const hashedPassword = await sha1(password);
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const responseBody = await response.text();
    if (responseBody.includes(suffix.toUpperCase())) {
        return true;
    } else {
        return false;
    }
}

async function sha1(message) {
    const buffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}

token = localStorage.getItem.token;
fetch("http://127.0.0.1:8000/view", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Token ${token}",
    },
})
    .then((response) => {
        return response.json();
    })
    .then((jsonData) => {
        jsonData.forEach(async function (element) {
            var result = await checkPassword(element.encrypted_password);
            if (result) {
                var divElement = document.createElement('div');
                divElement.classList.add('drkwebntfcation');
                var usernameParagraph = document.createElement('p');
                var usernameSpan = document.createElement('span');
                usernameSpan.style.fontFamily = "'Silkscreen', sans-serif";
                usernameSpan.style.color = "#ffe66b";
                usernameSpan.textContent = "Username:";
                var usernameLink = document.createElement('a');
                usernameLink.href = "#";
                usernameLink.style.color = "#fff";
                usernameLink.style.textDecoration = "none";
                usernameLink.style.fontSize = "20px";
                usernameLink.textContent = element.username;
                usernameParagraph.appendChild(usernameSpan);
                usernameParagraph.appendChild(usernameLink);
                var domainParagraph = document.createElement('p');
                var domainSpan = document.createElement('span');
                domainSpan.style.fontFamily = "'Silkscreen', sans-serif";
                domainSpan.style.color = "#ffe66b";
                domainSpan.textContent = "Domain:";
                var domainLink = document.createElement('a');
                domainLink.classList.add('Domains');
                domainLink.href = "#";
                domainLink.style.color = "#fff";
                domainLink.style.textDecoration = "none";
                domainLink.style.fontSize = "20px";
                domainLink.textContent = element.domain.name;
                domainParagraph.appendChild(domainSpan);
                domainParagraph.appendChild(domainLink);
                divElement.appendChild(usernameParagraph);
                divElement.appendChild(domainParagraph);
                var divCont = document.getElementsByClassName("drkwebntfcations")[0];
                divCont.appendChild(divElement);

            }
        });
    })
    .catch((error) => {
        console.log("Error:", error);
    });