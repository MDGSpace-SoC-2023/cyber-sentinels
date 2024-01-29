const FORM_MARKERS = [
  "login",
  "log-in",
  "log_in",
  "signin",
  "sign-in",
  "sign_in",
];
const OPENID_FIELDS = {
  selectors: [
    "input[name*=openid i]",
    "input[id*=openid i]",
    "input[class*=openid i]",
  ],
  types: ["text"],
};
const USERNAME_FIELDS = {
  selectors: [
    "input[autocomplete=username i]",
    "input[name=login i]",
    "input[name=user i]",
    "input[name=username i]",
    "input[name=username]",
    "input[name=email i]",
    "input[name=alias i]",
    "input[id=login i]",
    "input[id=user i]",
    "input[id=username i]",
    "input[id=email i]",
    "input[id=alias i]",
    "input[class=login i]",
    "input[class=user i]",
    "input[class=username i]",
    "input[class=email i]",
    "input[class=alias i]",
    "input[name*=login i]",
    "input[name*=user i]",
    "input[name*=email i]",
    "input[name*=alias i]",
    "input[id*=login i]",
    "input[id*=user i]",
    "input[id*=email i]",
    "input[id*=alias i]",
    "input[class*=login i]",
    "input[class*=user i]",
    "input[class*=email i]",
    "input[class*=alias i]",
    "input[type=email i]",
    "input[autocomplete=email i]",
    "input[type=tel i]",
    "input[name*=phonenumber i]",
    "input[id*=phonenumber i]",
    "input[class*=phonenumber i]",
  ],
  types: ["username", "email", "tel"],
};
const PASSWORD_FIELDS = {
  selectors: [
    "input[type=password i][autocomplete=current-password i]",
    "input[type=password i]",
    "input[name*=password i]",
    "input[id*=password i]",
    "input[name*=pass i]",
    "input[id*=pass i]",
    "input[class*=pass i]",
    "input[class*=password i]",
  ],
};
const INPUT_FIELDS = {
  selectors: PASSWORD_FIELDS.selectors
    .concat(USERNAME_FIELDS.selectors)
    .concat(OPENID_FIELDS.selectors),
};
const SUBMIT_FIELDS = {
  selectors: [
    "[type=submit i]",
    "button[name=login i]",
    "button[name=log-in i]",
    "button[name=log_in i]",
    "button[name=signin i]",
    "button[name=sign-in i]",
    "button[name=sign_in i]",
    "button[id=login i]",
    "button[id=log-in i]",
    "button[id=log_in i]",
    "button[id=signin i]",
    "button[id=sign-in i]",
    "button[id=sign_in i]",
    "button[class=login i]",
    "button[class=log-in i]",
    "button[class=log_in i]",
    "button[class=signin i]",
    "button[class=sign-in i]",
    "button[class=sign_in i]",
    "input[type=button i][name=login i]",
    "input[type=button i][name=log-in i]",
    "input[type=button i][name=log_in i]",
    "input[type=button i][name=signin i]",
    "input[type=button i][name=sign-in i]",
    "input[type=button i][name=sign_in i]",
    "input[type=button i][id=login i]",
    "input[type=button i][id=log-in i]",
    "input[type=button i][id=log_in i]",
    "input[type=button i][id=signin i]",
    "input[type=button i][id=sign-in i]",
    "input[type=button i][id=sign_in i]",
    "input[type=button i][class=login i]",
    "input[type=button i][class=log-in i]",
    "input[type=button i][class=log_in i]",
    "input[type=button i][class=signin i]",
    "input[type=button i][class=sign-in i]",
    "input[type=button i][class=sign_in i]",
    "button[name*=login i]",
    "button[name*=log-in i]",
    "button[name*=log_in i]",
    "button[name*=signin i]",
    "button[name*=sign-in i]",
    "button[name*=sign_in i]",
    "button[id*=login i]",
    "button[id*=log-in i]",
    "button[id*=log_in i]",
    "button[id*=signin i]",
    "button[id*=sign-in i]",
    "button[id*=sign_in i]",
    "button[class*=login i]",
    "button[class*=log-in i]",
    "button[class*=log_in i]",
    "button[class*=signin i]",
    "button[class*=sign-in i]",
    "button[class*=sign_in i]",
    "input[type=button i][name*=login i]",
    "input[type=button i][name*=log-in i]",
    "input[type=button i][name*=log_in i]",
    "input[type=button i][name*=signin i]",
    "input[type=button i][name*=sign-in i]",
    "input[type=button i][name*=sign_in i]",
    "input[type=button i][id*=login i]",
    "input[type=button i][id*=log-in i]",
    "input[type=button i][id*=log_in i]",
    "input[type=button i][id*=signin i]",
    "input[type=button i][id*=sign-in i]",
    "input[type=button i][id*=sign_in i]",
    "input[type=button i][class*=login i]",
    "input[type=button i][class*=log-in i]",
    "input[type=button i][class*=log_in i]",
    "input[type=button i][class*=signin i]",
    "input[type=button i][class*=sign-in i]",
    "input[type=button i][class*=sign_in i]",
  ],
};

function autofillCredentials(username, password) {
  const allFields = [...document.getElementsByTagName("input")];
  allFields.forEach((field) => {
    const lowerCaseName = field.name.toLowerCase();
    const lowerCasePlaceholder = field.placeholder.toLowerCase();

    if (
      USERNAME_FIELDS.selectors.some((selector) => field.matches(selector)) ||
      USERNAME_FIELDS.selectors.some((keyword) =>
        lowerCaseName.includes(keyword)
      ) ||
      USERNAME_FIELDS.selectors.some((keyword) =>
        lowerCasePlaceholder.includes(keyword)
      )
    ) {
      field.value = username;
    }

    if (
      PASSWORD_FIELDS.selectors.some((selector) => field.matches(selector)) ||
      PASSWORD_FIELDS.selectors.some((keyword) =>
        lowerCaseName.includes(keyword)
      ) ||
      PASSWORD_FIELDS.selectors.some((keyword) =>
        lowerCasePlaceholder.includes(keyword)
      )
    ) {
      field.value = password;
    }
  });
}

function onDOMContentLoaded() {
  var loginButton = document.querySelector(SUBMIT_FIELDS.selectors.join(", "));
  if (loginButton) {
    loginButton.addEventListener("click", function (event) {
      const usernameInput = document.querySelector(
        USERNAME_FIELDS.selectors.join(", ")
      );
      const passwordInput = document.querySelector(
        PASSWORD_FIELDS.selectors.join(", ")
      );
      const username = usernameInput.value;
      const password = passwordInput.value;

      chrome.runtime.sendMessage({
        type: "credentials",
        data: {
          username: username,
          password: password,
        },
      });
    });
  } else {
    console.error("Login button not found.");
  }
}

const tabUrl = window.location.href;

const hasLoginButton = document.querySelector(
  SUBMIT_FIELDS.selectors.join(", ")
);
const hasPasswordFields = document.querySelector(
  PASSWORD_FIELDS.selectors.join(", ")
);

chrome.runtime.sendMessage({
  source: "contentScript",
  action: "tabUrlFetched",
  url: tabUrl,
  hasLoginButton: hasLoginButton,
  hasPasswordFields: hasPasswordFields,
});

onDOMContentLoaded();
