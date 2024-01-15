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
    console.log(jsonData);
    jsonData.forEach(function (element) {
      // console.log("ID:", element.id);
      // console.log("User:", element.user);
      // console.log("Sync:", element.sync);
      // console.log("Encrypted Password:", element.encrypted_password);
      // console.log("Username:", element.username);
      // console.log("Notes:", element.notes);
      // console.log("Created At:", element.created_at);
      // console.log("Updated At:", element.updated_at);
      // console.log("Device Identifier:", element.device_identifier);

      // Accessing properties in the nested "domain" object
      // console.log("Domain ID:", element.domain.id);
      // console.log("Domain Name:", element.domain.name);
      var domains = document.getElementsByClassName("filterDiv");
      var z = -1;
      for (var i = 0; i < domains.length; i++) {
        if (domains[i].innerHTML.includes(element.domain.name)) {
          z = i;
          break;
        }
      }
      var outerDiv = document.createElement("div");
      if(element.sync){
        outerDiv.className = "content visible ClouSync";
      }else{
        outerDiv.className = "content visible OnDev";
      }
      var labelElement = document.createElement("label");
      labelElement.className = "checkbox1 style-d1";
      var checkboxElement = document.createElement("input");
      checkboxElement.type = "checkbox";
      checkboxElement.value = "username";
      checkboxElement.className = "contentCheckboxes";
      checkboxElement.classList.add(element.domain.name);
      checkboxElement.onclick = function(){updtMsterChckBx(this);};
      var checkboxCheckmarkElement = document.createElement("div");
      checkboxCheckmarkElement.className = "checkbox__checkmark";
      labelElement.appendChild(checkboxElement);
      labelElement.appendChild(checkboxCheckmarkElement);
      var usernameParagraph = document.createElement("p");
      usernameParagraph.className = "usrnme";
      usernameParagraph.textContent = element.username;
      var passwordInput = document.createElement("input");
      passwordInput.type = "password";
      passwordInput.defaultValue = element.encrypted_password;
      passwordInput.className = "passwords";
      passwordInput.readOnly = true;
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
      
      // Append the path elements to the group element
      groupElement.appendChild(path1Element);
      groupElement.appendChild(path2Element);
      
      // Append the group element to the SVG element
      eyeIconSvg.appendChild(groupElement);
      
      // Append the SVG element to the document body or any other parent element
      
      var categoryParagraph = document.createElement("p");
      categoryParagraph.className = "ctgry";
      if(element.sync){
        categoryParagraph.textContent = "Cloud Synced";
      }else{
        categoryParagraph.textContent = "On Device";
      }
      var tagParagraph = document.createElement("p");
      tagParagraph.className = "tag";
      tagParagraph.textContent = element.notes;
      var colorBoxesSpan = document.createElement("span");
    //   colorBoxesSpan.id = "color-boxes";
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
      editButtonSvg.setAttribute("data-domain", "www.amazon.com");
      editButtonSvg.setAttribute("height", "30px");
      editButtonSvg.setAttribute("width", "20px");
      editButtonSvg.setAttribute("viewBox", "0 0 576 512");
      editButtonSvg.className = "editbtn";
      outerDiv.appendChild(labelElement);
      outerDiv.appendChild(usernameParagraph);
      outerDiv.appendChild(passwordInput);
      outerDiv.appendChild(eyeIconSvg);
      outerDiv.appendChild(categoryParagraph);
      outerDiv.appendChild(tagParagraph);
      outerDiv.appendChild(colorBoxesSpan);
      outerDiv.appendChild(editButtonSvg);
      if (z != -1) {
        console.log("Found");
        domains[z].insertAdjacentElement('afterend', outerDiv);
      } else {
        console.log("Not found");
      }
      // console.log("Domain Vault:", element.domain.vault);

      // console.log("----------------------------");
    });
  })
  .catch((error) => {
    console.log("Error:", error);
  });
