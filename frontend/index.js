const usernameElem = document.getElementById('username');
const emailElem = document.getElementById('email');
const passwordElem = document.getElementById('password');
const createButtonElem = document.getElementById('create-button');

const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');

async function createAccount(accountInformation) {
  const response = await fetch('http://localhost:3000/api/signup', {
    method: 'POST',
    body: JSON.stringify(accountInformation),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  console.log(data);
}

async function login(loginInformation) {
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    body: JSON.stringify(loginInformation),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();

  if (data.success) {
    window.location.href = 'http://localhost:3000/loggedin.html';
  }
}


createButtonElem.addEventListener('click', () => {
  let accountInformation = {
    username: usernameElem.value,
    email: emailElem.value,
    password: passwordElem.value
  }
  createAccount(accountInformation);
  console.log("kontouppgifter: " + JSON.stringify(accountInformation));
  usernameElem.value = "";
  emailElem.value = "";
  passwordElem.value = "";
});

loginButton.addEventListener('click', () => {
  let loginInformation = {
    username: loginUsername.value,
    password: loginPassword.value
  }
  login(loginInformation);
});
