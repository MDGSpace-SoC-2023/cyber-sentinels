token = localStorage.getItem.token;
async function fetchnoti() {
    var response = await fetch("http://127.0.0.1:8000/notificationslist", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token ${token}",
        },
    });
    var jsonData = await response.json();
    jsonData.forEach(element => {
        var notifications = document.getElementsByClassName("nofctions")[0];
        const notificationContainer = document.createElement('div');
        notificationContainer.classList.add('ntfcation');
        if (element.status == "Created") {
            notificationContainer.classList.add('Add');
        } else if (element.status == "Updated") {
            notificationContainer.classList.add('Upd');
        } else if (element.status == "Deleted") {
            notificationContainer.classList.add('Del');
        } else {
            notificationContainer.classList.add('Dep');
        }
        const innerDiv = document.createElement('div');
        innerDiv.classList.add('dttm');
        const dateParagraph = document.createElement('p');
        const createdDate = new Date(element.created_at);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };

        const formattedDate = createdDate.toLocaleDateString('en-US', options);

        dateParagraph.textContent = formattedDate;
        const severityDiv = document.createElement('div');
        const severitySpan = document.createElement('span');
        if (element.status == "Deprecated") {
            severityDiv.classList.add('severity');
            severitySpan.textContent = 'Severe';
        } else {
            severityDiv.classList.add('severity1');
            severitySpan.textContent = 'Null';
        }
        innerDiv.appendChild(dateParagraph);
        severityDiv.appendChild(severitySpan);
        innerDiv.appendChild(severityDiv);
        notificationContainer.appendChild(innerDiv);
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        const usernameParagraph = document.createElement('p');
        const usernameSpan = document.createElement('span');
        usernameSpan.style.fontFamily = 'Silkscreen, sans-serif';
        usernameSpan.style.color = '#ffe66b';
        usernameSpan.textContent = 'Username: ';
        const usernameLink = document.createElement('a');
        usernameLink.href = "#";
        usernameLink.textContent = element.username;
        usernameParagraph.appendChild(usernameSpan);
        usernameParagraph.appendChild(usernameLink);
        const domainParagraph = document.createElement('p');
        const domainSpan = document.createElement('span');
        domainSpan.style.fontFamily = 'Silkscreen, sans-serif';
        domainSpan.style.color = '#ffe66b';
        domainSpan.textContent = 'Domain: ';
        const domainLink = document.createElement('a');
        domainLink.href = "#";
        domainLink.textContent = element.domain;
        domainParagraph.appendChild(domainSpan);
        domainParagraph.appendChild(domainLink);
        const textParagraph = document.createElement('p');
        if (element.status == "Created") {
            textParagraph.textContent = "Your password for this domain and password has been added successfully.";
        } else if (element.status == "Updated") {
            textParagraph.textContent = "Your password for this domain and password has been updated successfully.";
        } else if (element.status == "Deleted") {
            textParagraph.textContent = "Your password for this domain and password has been deleted successfully.";
        } else {
            textParagraph.textContent = "Your password for this domain and password has been deprecated.Please change this for security purposes.";
        }
        messageDiv.appendChild(usernameParagraph);
        messageDiv.appendChild(domainParagraph);
        messageDiv.appendChild(textParagraph);
        notificationContainer.appendChild(messageDiv);
        notifications.insertBefore(notificationContainer, notifications.firstChild);
    });

}
fetchnoti();
// fetch("http://127.0.0.1:8000/notificationslist", {
//     method: "GET",
//     headers: {
//         "Content-Type": "application/json",
//         Authorization: "Token ${token}",
//     },
// })
    // .then((response) => {
    //     return response.json();
    // })
//     .then((jsonData) => {
//     jsonData.forEach(element => {
//         var notifications = document.getElementsByClassName("nofctions")[0];
//         const notificationContainer = document.createElement('div');
//         notificationContainer.classList.add('ntfcation');
//         if (element.status == "Created") {
//             notificationContainer.classList.add('Add');
//         } else if (element.status == "Updated") {
//             notificationContainer.classList.add('Upd');
//         } else if (element.status == "Deleted") {
//             notificationContainer.classList.add('Del');
//         } else {
//             notificationContainer.classList.add('Dep');
//         }
//         const innerDiv = document.createElement('div');
//         innerDiv.classList.add('dttm');
//         const dateParagraph = document.createElement('p');
//         const createdDate = new Date(element.created_at);
//         const options = { month: 'long', day: 'numeric', year: 'numeric' };

//         const formattedDate = createdDate.toLocaleDateString('en-US', options);

//         dateParagraph.textContent = formattedDate;
//         const severityDiv = document.createElement('div');
//         const severitySpan = document.createElement('span');
//         if (element.status == "Deprecated") {
//             severityDiv.classList.add('severity');
//             severitySpan.textContent = 'Severe';
//         } else {
//             severityDiv.classList.add('severity1');
//             severitySpan.textContent = 'Null';
//         }
//         innerDiv.appendChild(dateParagraph);
//         severityDiv.appendChild(severitySpan);
//         innerDiv.appendChild(severityDiv);
//         notificationContainer.appendChild(innerDiv);
//         const messageDiv = document.createElement('div');
//         messageDiv.classList.add('message');
//         const usernameParagraph = document.createElement('p');
//         const usernameSpan = document.createElement('span');
//         usernameSpan.style.fontFamily = 'Silkscreen, sans-serif';
//         usernameSpan.style.color = '#ffe66b';
//         usernameSpan.textContent = 'Username: ';
//         const usernameLink = document.createElement('a');
//         usernameLink.href = "#";
//         usernameLink.textContent = element.username;
//         usernameParagraph.appendChild(usernameSpan);
//         usernameParagraph.appendChild(usernameLink);
//         const domainParagraph = document.createElement('p');
//         const domainSpan = document.createElement('span');
//         domainSpan.style.fontFamily = 'Silkscreen, sans-serif';
//         domainSpan.style.color = '#ffe66b';
//         domainSpan.textContent = 'Domain: ';
//         const domainLink = document.createElement('a');
//         domainLink.href = "#";
//         domainLink.textContent = element.domain;
//         domainParagraph.appendChild(domainSpan);
//         domainParagraph.appendChild(domainLink);
//         const textParagraph = document.createElement('p');
//         if (element.status == "Created") {
//             textParagraph.textContent = "Your password for this domain and password has been added successfully.";
//         } else if (element.status == "Updated") {
//             textParagraph.textContent = "Your password for this domain and password has been updated successfully.";
//         } else if (element.status == "Deleted") {
//             textParagraph.textContent = "Your password for this domain and password has been deleted successfully.";
//         } else {
//             textParagraph.textContent = "Your password for this domain and password has been deprecated.Please change this for security purposes.";
//         }
//         messageDiv.appendChild(usernameParagraph);
//         messageDiv.appendChild(domainParagraph);
//         messageDiv.appendChild(textParagraph);
//         notificationContainer.appendChild(messageDiv);
//         notifications.insertBefore(notificationContainer, notifications.firstChild);
//     });
// })
//     .catch((error) => {
//         console.log("Error:", error);
//     });