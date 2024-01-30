## Bitsafe - A Secure Password Management Extension

In the era of active digital engagement, Safeguarding our digital identities has never been more critical. To make this more manageable, We came up with a solution.

Introducing Bitsafe, An advanced and comprehensive password management solution crafted to elevate the standards of password security. BitSafe is a comprehensive browser extension that allows users to take control of their online security with seamless password management. With a focus on security and user convenience, Bitsafe offers various features which provide users with a robust and intuitive solution for protecting their passwords online. It simplifies password handling across browsers and devices, safeguarding credentials from compromise and enhancing digital well-being.

## Table of Contents

- [Installation](#installation)
- [Dependencies](#dependencies)
- [Run-locally](#run-locally)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Screenshots](#screenshots)
- [HaveIBeenPwned API](#haveibeenpwned-api)
- [Authors](#authors)
- [FAQ](#faq)

## Installation

Before you can start using this project, you need to set up your environment. Follow these steps for installation and configuration:

**Install Python:**
   
   If you don't already have Python installed on your system, you can download it from the official Python website:

   - [Python Official Website](https://www.python.org/downloads/)

   Please choose the appropriate version (recommended: Python 3.12.0) for your operating system.
    

**Install Project Dependencies:**

   - Open your terminal or command prompt.
   - Navigate to the project directory using the `cd` command.
   - Run the following command to install the required Python libraries from the provided `requirements.txt` file:

      ```shell
      pip install -r requirements.txt
      ```

**Setup Database:**

Run the following commands to apply migrations and create the database:

```shell
python manage.py makemigrations
python manage.py migrate
```

**Run the Deployment Server:**

Start the Django development server using the following command:

```shell
python manage.py runserver
```
Visit http://127.0.0.1:8000/ in your web browser to access the extension locally.

**Browser Extension Installation:**

Load the extension in your browser by following these steps:

     1. Open your browser and navigate to the extensions or add-ons page.
     2. Enable developer mode.
     3. Choose to load an unpacked extension.
     4. Select the extension folder within your project directory.

Setup settings.py:

     1. Navigate to the backend/BitSafe/ directory.
     2. Use a text editor to open the settings.py file.
     3. Scroll down or use the search function in your text editor to locate the CSRF_TRUSTED_ORIGINS setting. It's   typically around line 75.
     4. Launch Google Chrome and navigate to the "Extensions" page. You can do this by typing chrome://extensions/ in the address bar and pressing Enter.
     5. Locate the extension id in the Bitsafe extension.
     6. Add the Chrome extension ID to the CSRF_TRUSTED_ORIGINS list as per the format in the comment there.

Now, the extension is ready for use. Customize the settings and enjoy a secure password management experience!

## Dependencies

- [cryptojs](https://github.com/brix/crypto-js)
- [platformjs](https://github.com/bestiejs/platform.js)

## Run Locally

Clone the project

```bash
  git clone https://github.com/MDGSpace-SoC-2023/cyber-sentinels.git
```

Go to the project directory

```bash
  cd cyber-sentinels/backend
```

Start the server

```bash
  python manage.py runserver
```

Navigate to http://127.0.0.1:8000/.

After cloning the repository, follow these steps to set up the browser extension:

    1. Open your browser and navigate to the "Manage Extensions" page.

    2. Turn on developer mode.

    3. Load the unpacked extension:

        a. Navigate to the "extension" folder in the cloned repository, which contains the `manifest.json` file.

        b. Select the "extension" folder and load it as an unpacked extension.

Now, you can start working with the extension.

## Tech Stack

**Client:** HTML, CSS, JavaScript

**Server:** Python, Django

**API:** Have I Been Pwned?

## Features

#### Synced Password Management
Allows the synchronization of chosen passwords across devices. Users can decide which passwords to sync across devices.

#### Password Generator
Access to our password generator that creates unique passwords, enabling users to set stronger passwords for their accounts.

#### Deprecated Password Alerts
Notifies users when their passwords become outdated, with reminders scheduled every 90 days for optimal security maintenance.

#### Password Health Check
Conducts password health checks, identifying weak passwords, providing insights into their credential's security posture.

#### Password Usage Monitoring
Provides insights into password usage, enabling users to track the frequency and usage patterns of their passwords across various websites. This helps users prioritize password updates and enhance overall security.

#### Dark Web Monitoring
Scans the dark web for any signs of compromised passwords. If found, the user will be promptly displayed the corresponding username, allowing them to take immediate action to update them.

#### Autofill & AutoCapture
Simplifies the login process by automatically populating login credentials on websites, easing the user experience and saving time.

## Screenshots

![Dashboard](https://imgtr.ee/images/2024/01/29/fb929ca7fb219d64748e8a97fe82f493.png)
------------
![ExtensionHome](https://imgtr.ee/images/2024/01/29/b84ce673cd97568e6c842f924fd8786f.png)
------------
![ExtensionList](https://imgtr.ee/images/2024/01/29/f63cde6798bb109e56d7fbfb82e824df.png)

## HaveIBeenPwned API 

This section provides information on how to use the Have I Been Pwned API to check if a password has been compromised in a data breach.

#### Get item

```http
  GET /api/${id}
```
'id' is the first 5 chars of the sha1 format of your password.

### Check if a password has been exposed in any known data breaches using k-Anonymity.



| Parameter | Type     | Description                                                    |
| :-------- | :------- | :------------------------------------------------------------- |
| `id`      | `string` | **Required**. First 5 characters of SHA-1 hash of the password |

#### Example Usage:

```javascript
const axios = require('axios');
const crypto = require('crypto');

const apiUrl = 'https://api.pwnedpasswords.com/range';

// Function to check password exposure using k-Anonymity
async function checkPasswordExposure(password) {
  const sha1Hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase().substring(0, 5);

  try {
    const response = await axios.get(`${apiUrl}/${sha1Hash}`);
    const breachedPasswords = response.data.split('\n');

    for (const breachedPassword of breachedPasswords) {
      const [suffix, count] = breachedPassword.split(':');
      console.log(`Password suffix: ${suffix}, Breach count: ${count}`);
    }
  } catch (error) {
    console.error(error.response.data);
  }
}

// Example usage
const userPassword = 'test@123';
checkPasswordExposure(userPassword);


```

## Authors

- [**Ritwik Durga**](https://www.github.com/ritwikdurga)
- [**Chukka Nithin**](https://www.github.com/nithinchukka)
- [**Abhijit Chunduri**](https://www.github.com/abhijitch1)

## FAQ

#### Are my passwords safe enough with you?

Our virtual vault would make Fort Knox envious!

#### Do I have to remember all my passwords?

The only passwords you'll need is 'Password123' - Just kidding! You have one account password. We take care of the rest.

#### How do I create a strong password?

Creating a strong password is essential for protecting your accounts. It should be at least 8 characters long, include a combination of letters, numbers, and special characters, and avoid using easily guessable information like your name or birthdate. You can use our Password Generator to get some unique and strong passwords.

#### Can I use the same password for multiple accounts?

It is not recommended to use the same password for multiple accounts. If one account is compromised, it could put all of your other accounts at risk. We encourage you to use unique passwords for each of your accounts.

#### What should I do if I forget my password?

If you forget your password, you can click on the 'Forgot Password' link on the login page. You will be prompted to enter your email address, and we will send you instructions on how to reset your password.