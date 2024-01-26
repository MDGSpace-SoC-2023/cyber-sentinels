token = localStorage.getItem.token;
async function fetchData(token) {
    var response = await fetch("http://127.0.0.1:8000/view", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });
    var jsonData = await response.json();
    return jsonData;
}
var collapsibles = document.getElementsByClassName("Arrow");
collapsibles[0].addEventListener("click", function () {
    var menu = document.getElementsByClassName("Menu")[0];
    menu.classList.toggle("hidden");
    var mainSection = document.getElementsByClassName("Main")[0];
    mainSection.classList.toggle("full-width", menu.classList.contains("hidden"));
    var Heading = document.getElementsByClassName("heading")[0];
    var arrow = document.getElementsByClassName("Arrow")[0];
    var head = document.getElementsByClassName("head")[0];
    if (menu.classList.contains('hidden')) {
        arrow.innerHTML = "&#707;";
        Heading.style.left = "2%";
        head.style.marginLeft = "25%";
    } else {
        arrow.innerHTML = "&#706;";
        Heading.style.left = "22%";
        head.style.marginLeft = "23%";
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
var hashedMasterPassword;
var salt;
var decryptionKey;
var secretKey;
async function checkBreaches(jsonData) {
    var response = await fetch("http://127.0.0.1:8000/auth/master", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });
    var data = await response.json();
    hashedMasterPassword = data.hashedMasterPassword;
    salt = data.salt;
    decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, { keySize: 256 / 32, iterations: 10000 });
    secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
    for (const element of jsonData) {
        var decryptedBytes = CryptoJS.AES.decrypt(element.encrypted_password, secretKey);
        var decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        const password = decryptedData;
        var result = await checkPassword(password);
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
            var idelem = document.createElement('p');
            idelem.textContent = element.id;
            idelem.style.display = "none";
            divElement.appendChild(idelem);
            var domainLink = document.createElement('a');
            domainLink.classList.add('Domains');
            domainLink.href = "#";
            domainLink.style.color = "#fff";
            domainLink.style.textDecoration = "none";
            domainLink.style.fontSize = "20px";
            domainLink.textContent = element.domain.name;
            domainParagraph.appendChild(domainSpan);
            domainParagraph.appendChild(domainLink);
            usernameParagraph.style.marginBottom = "-12px";
            domainParagraph.style.marginTop = "-12px";
            divElement.appendChild(usernameParagraph);
            var editButtonSvg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            editButtonSvg.setAttribute("height", "30px");
            editButtonSvg.setAttribute("width", "20px");
            editButtonSvg.setAttribute("viewBox", "0 0 576 512");
            editButtonSvg.classList.add("editbtn");
            var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('fill', '#ffffff');
            pathElement.setAttribute('d', 'M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z');
            editButtonSvg.appendChild(pathElement);
            divElement.appendChild(editButtonSvg);
            divElement.appendChild(domainParagraph);
            var divCont = document.getElementsByClassName("drkwebntfcations")[0];
            divCont.appendChild(divElement);
        }
    }
    runremaining();
}
async function main() {
    var jsonData = await fetchData(token);
    await checkBreaches(jsonData);
}
main();
function runremaining() {
    var showBtn = document.getElementsByClassName("editbtn");
    for (const btn of showBtn) {
        btn.addEventListener("click", showModal);
    }
}
const cancelButton = document.querySelector("#cancelButton");
async function showModal() {
    const modalBox = document.querySelector(".modal-box");
    modalBox.style.display = "block";
    var clickedBtn = event.currentTarget;
    var conElem = clickedBtn.parentElement;
    var id = conElem.firstChild.textContent;
    var data1 = await fetch(`http://127.0.0.1:8000/${id}/view`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });
    var jsonData = await data1.json();
    var usrinmodalBox = modalBox.querySelector("#username");
    usrinmodalBox.value = jsonData.username;
    var Syncchek = modalBox.querySelector("#sync");
    Syncchek.checked = false;
    if (jsonData.sync) {
        Syncchek.checked = true;
    }
    var customText = modalBox.querySelector("#customText");
    var domainelem = modalBox.querySelector("#domain");
    domainelem.value = jsonData.domain.name;
    customText.value = jsonData.notes;
    var updtid = modalBox.querySelector(".updateid");
    updtid.textContent = id;
    var pswdinmodalBox = modalBox.querySelector("#passwordField");
    var decryptedBytes = CryptoJS.AES.decrypt(jsonData.encrypted_password, secretKey);
    var decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    pswdinmodalBox.value = decryptedData;
}
function hideModal() {
    const modalBox = document.querySelector(".modal-box");
    modalBox.style.display = "none";
    overlay.style.display = "none";
}
const passwordField = document.getElementById("passwordField");
const togglePasswordVisibilityOpen = document.getElementById(
    "togglePasswordVisibilityOpen"
);
const togglePasswordVisibilityClosed = document.getElementById(
    "togglePasswordVisibilityClosed"
);
togglePasswordVisibilityOpen.addEventListener("click", function () {
    passwordField.type = "password";
    togglePasswordVisibilityOpen.style.display = "none";
    togglePasswordVisibilityClosed.style.display = "inline-block";
});
togglePasswordVisibilityClosed.addEventListener("click", function () {
    passwordField.type = "text";
    togglePasswordVisibilityClosed.style.display = "none";
    togglePasswordVisibilityOpen.style.display = "inline-block";
});
cancelButton.addEventListener("click", hideModal);
async function updatePassword(event) {
    event.preventDefault();
    const modalBox = document.querySelector(".modal-box");
    const csrfToken = modalBox.querySelector(
        "form.form input[name='csrfmiddlewaretoken']"
    ).value;
    var updateId = modalBox.querySelector(".updateid").textContent;
    var username = modalBox.querySelector("#username").value;
    var password = modalBox.querySelector("#passwordField").value;
    var sync = modalBox.querySelector("#sync").checked;
    var notes = modalBox.querySelector("#customText").value;
    var token = localStorage.getItem('token');
    var deviceId = '';
    if (!sync) {
        deviceId = generateDeviceId();
    }
    console.log(deviceId);
    var response = await fetch("http://127.0.0.1:8000/auth/master", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });
    // fetch("http://127.0.0.1:8000/auth/master", {
    //     method: 'GET',
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Token ${token}`,
    //     },
    // })
    //.then(response => response.json())
    var data = await response.json();
    const hashedMasterPassword = data.hashedMasterPassword;
    const salt = data.salt;
    const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, { keySize: 256 / 32, iterations: 10000 });
    const secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
    var encryptedData = CryptoJS.AES.encrypt(password, secretKey).toString();
    var response2 = await fetch(`http://127.0.0.1:8000/${updateId}/update/`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
            username: username,
            encrypted_password: encryptedData,
            sync: sync,
            notes: notes,
            device_identifier: deviceId
        }),
    });
    try {
        if (!response2.ok) {
            return response2.json().then(errors => {
                throw new Error(JSON.stringify(errors));
            });
        }
        window.location.href = 'http://127.0.0.1:8000/monitor';
    } catch (error) {
        console.log("Error:", error);
    }
    // .then(data => {
    //     const hashedMasterPassword = data.hashedMasterPassword;
    //     const salt = data.salt;
    //     const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, { keySize: 256 / 32, iterations: 10000 });
    //     const secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
    //     var encryptedData = CryptoJS.AES.encrypt(password, secretKey).toString();
    //     fetch(`http://127.0.0.1:8000/${updateId}/update/`, {
    //         method: "PUT",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': csrfToken,
    //             'Authorization': `Token ${token}`,
    //         },
    //         body: JSON.stringify({
    //             username: username,
    //             encrypted_password: encryptedData,
    //             sync: sync,
    //             notes: notes,
    //             device_identifier: deviceId
    //         }),
    //     }).then(response => {
    //         if (!response.ok) {
    //             return response.json().then(errors => {
    //                 throw new Error(JSON.stringify(errors));
    //             });
    //         }
    //         window.location.href = 'http://127.0.0.1:8000/monitor';
    //     }).catch(error => console.log(error));
    // })
    // .catch(error => console.error('Error:', error));
}
function generateDeviceId() {
    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        navigator.hardwareConcurrency,
        navigator.serviceWorker,
        navigator.mediaCapabilities,
        new Date().getTimezoneOffset(),
        screen.pixelDepth,
    ].join('');
    console.log(navigator.mediaCapabilities);
    const hashedId = hashString(fingerprint);
    return hashedId;
}
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
    }
    return hash.toString(16);
}