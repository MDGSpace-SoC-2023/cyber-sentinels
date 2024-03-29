const resultEl = document.getElementById("result");
const lengthEl = document.getElementById("length");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const generateEl = document.getElementById("generate");
const clipboard = document.getElementById("clipboard");

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};
const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
  window.location.href = "popup.html";
});

const copyMessage = document.getElementById("copyMessage");

clipboard.addEventListener("click", async () => {
  const password = resultEl.innerText;

  if (!password) {
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
    copyMessage.textContent = "Password copied to clipboard";
    copyMessage.style.display = "block";
    setTimeout(() => {
      copyMessage.style.display = "none";
    }, 3000);
  } catch (err) {
    console.error("Failed to copy:", err);
    copyMessage.textContent =
      "Failed to copy password to clipboard. Please try again.";
    copyMessage.style.color = "#ff0000";
    copyMessage.style.display = "block";
  }
});

generate.addEventListener("click", () => {
  const maxLength = 20;

  let length = +lengthEl.value;
  if (length > maxLength) {
    length = maxLength;
    lengthEl.value = maxLength;
  }

  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numbersEl.checked;
  const hasSymbol = symbolsEl.checked;

  resultEl.innerText = generatePassword(
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    length
  );
});

function generatePassword(lower, upper, number, symbol, length) {
  length = Math.min(length, 20);

  let generatedPassword = "";
  const typesCount = lower + upper + number + symbol;
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  if (typesCount === 0) {
    return "";
  }

  for (let i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }

  const finalPassword = generatedPassword.slice(0, length);

  return finalPassword;
}

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
  return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

var lengthInput = document.getElementById("length");
var generateButton = document.getElementById("generate");
var errorSpan = document.getElementById("error");
var resultSpan = document.getElementById("result");

lengthInput.addEventListener("input", function () {
  var enteredValue = parseInt(this.value, 10);

  if (enteredValue < 8) {
    errorSpan.textContent = "Minimum 8 characters required";
    generateButton.disabled = true;
    resultSpan.textContent = "";
    errorSpan.style.color = "#ff0000";
  } else if (enteredValue > 20) {
    errorSpan.textContent = "Length should not be more than 20";
    generateButton.disabled = true;
    resultSpan.textContent = "";
    errorSpan.style.color = "#ff0000";
  } else {
    errorSpan.textContent = "";
    generateButton.disabled = false;
  }
});
