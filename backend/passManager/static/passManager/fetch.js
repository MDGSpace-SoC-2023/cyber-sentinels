var token = localStorage.getItem('token');
fetch("http://127.0.0.1:8000/auth/master", {
  method: 'GET',
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  },
})
  .then(response => response.json())
  .then(data => {
    const hashedMasterPassword = data.hashedMasterPassword;
    const salt = data.salt;
    const decryptionKey = CryptoJS.PBKDF2(hashedMasterPassword, salt, { keySize: 256 / 32, iterations: 10000 });
    const secretKey = decryptionKey.toString(CryptoJS.enc.Hex);
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
        jsonData.forEach(function (element) {
          var domains = document.getElementsByClassName("filterDiv");
          var z = -1;
          for (var i = 0; i < domains.length; i++) {
            if (domains[i].innerHTML.includes(element.domain.name)) {
              z = i;
              break;
            }
          }
          var outerDiv = document.createElement("div");
          if (element.sync) {
            outerDiv.className = "content visible ClouSync";
          } else {
            outerDiv.className = "content visible OnDev";
          }
          var labelElement = document.createElement("label");
          labelElement.className = "checkbox1 style-d1";
          var checkboxElement = document.createElement("input");
          checkboxElement.type = "checkbox";
          checkboxElement.value = "username";
          checkboxElement.className = "contentCheckboxes";
          checkboxElement.classList.add(element.domain.name);
          checkboxElement.onclick = function () { updtMsterChckBx(this); };
          var checkboxCheckmarkElement = document.createElement("div");
          checkboxCheckmarkElement.className = "checkbox__checkmark";
          labelElement.appendChild(checkboxElement);
          labelElement.appendChild(checkboxCheckmarkElement);
          var usernameParagraph = document.createElement("p");
          usernameParagraph.className = "usrnme";
          usernameParagraph.textContent = element.username;
          var passwordInput = document.createElement("input");
          passwordInput.type = "password";
          var decryptedBytes = CryptoJS.AES.decrypt(element.encrypted_password, secretKey);
          var decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
          console.log("Decrypted Data:", decryptedData);
          passwordInput.defaultValue = decryptedData;
          passwordInput.className = "passwords";
          passwordInput.readOnly = true;
          var idelem = document.createElement("p");
          idelem.textContent = element.id;
          idelem.style.display = "none";
          var s = "idelem" + element.domain.name;
          idelem.classList.add(s);
          outerDiv.appendChild(idelem);
          var eyeIconSvg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          eyeIconSvg.setAttribute("height", "10%");
          eyeIconSvg.setAttribute("width", "2.5%");
          eyeIconSvg.setAttribute("viewBox", "0 0 24 24");
          eyeIconSvg.setAttribute("fill", "none");
          eyeIconSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          eyeIconSvg.classList.add("eyeicon");
          var groupElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );
          groupElement.setAttribute("stroke", "#fff");
          groupElement.setAttribute("stroke-linecap", "round");
          groupElement.setAttribute("stroke-linejoin", "round");
          groupElement.setAttribute("stroke-width", "2");
          var path1Element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path1Element.setAttribute(
            "d",
            "m15.0007 12c0 1.6569-1.3431 3-3 3-1.6568 0-2.99997-1.3431-2.99997-3s1.34317-3 2.99997-3c1.6569 0 3 1.3431 3 3z"
          );
          var path2Element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path2Element.setAttribute(
            "d",
            "m12.0012 5c-4.47766 0-8.26794 2.94288-9.54222 7 1.27426 4.0571 5.06456 7 9.54222 7 4.4776 0 8.2679-2.9429 9.5422-7-1.2743-4.05709-5.0646-7-9.5422-7z"
          );
          groupElement.appendChild(path1Element);
          groupElement.appendChild(path2Element);
          eyeIconSvg.appendChild(groupElement);
          var categoryParagraph = document.createElement("p");
          categoryParagraph.className = "ctgry";
          if (element.sync) {
            categoryParagraph.textContent = "Cloud Synced";
          } else {
            categoryParagraph.textContent = "On Device";
          }
          var tagParagraph = document.createElement("p");
          tagParagraph.className = "tag";
          tagParagraph.textContent = element.notes;
          var colorBoxesSpan = document.createElement("span");
          colorBoxesSpan.className = "color-boxes";
          var tooltipTextSpan = document.createElement("span");
          tooltipTextSpan.id = "tooltiptext";
          tooltipTextSpan.className = "tooltiptext";
          tooltipTextSpan.textContent = "Tooltiptext";
          colorBoxesSpan.appendChild(tooltipTextSpan);
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
          outerDiv.appendChild(labelElement);
          outerDiv.appendChild(usernameParagraph);
          outerDiv.appendChild(passwordInput);
          outerDiv.appendChild(eyeIconSvg);
          outerDiv.appendChild(categoryParagraph);
          outerDiv.appendChild(tagParagraph);
          outerDiv.appendChild(colorBoxesSpan);
          outerDiv.appendChild(editButtonSvg);
          if (z != -1) {
            domains[z].insertAdjacentElement('afterend', outerDiv);
          } else {
            var checkboxLabel = document.createElement('label');
            checkboxLabel.classList.add('checkbox', 'style-d');
            var checkboxInput = document.createElement('input');
            checkboxInput.type = 'checkbox';
            checkboxInput.classList.add('Checkboxes');
            checkboxInput.value = element.domain.name;
            checkboxInput.onclick = function () {
              tglAllcntntchckbxs(this);
            };
            var checkboxCheckmark = document.createElement('div');
            checkboxCheckmark.classList.add('checkbox__checkmark');
            checkboxLabel.appendChild(checkboxInput);
            checkboxLabel.appendChild(checkboxCheckmark);
            var buttonElement = document.createElement('button');
            buttonElement.classList.add('filterDiv', 'full-width');
            var buttonText = document.createTextNode(element.domain.name);
            var colorBox = document.createElement('span');
            colorBox.classList.add('color-box');
            var tooltipText = document.createElement('span');
            tooltipText.classList.add('tooltiptext');
            tooltipText.textContent = 'Tooltip text';
            colorBox.appendChild(tooltipText);
            buttonElement.appendChild(buttonText);
            buttonElement.appendChild(colorBox);
            var usrname = document.getElementsByClassName("UsrnmeNPasswrds")[0];
            usrname.appendChild(checkboxLabel);
            usrname.appendChild(buttonElement);
            var domidelem = document.createElement("p");
            domidelem.style.display = "none";
            domidelem.textContent = element.domain.id;
            domidelem.classList.add("domids");
            buttonElement.appendChild(domidelem);
            buttonElement.insertAdjacentElement('afterend', outerDiv);
          }
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  })
  .catch(error => {
    console.error('Error:', error);
  });
