const emailElem = document.getElementById('email');
const logoutBtn = document.getElementById('logout');
const deleteBtn = document.getElementById('delete');
const passwordInput = document.getElementById('passwordInput');
const passwordBtn = document.getElementById('passwordBtn');

async function isLoggedIn() {
  const response = await fetch('http://localhost:3000/api/loggedin');
  const data = await response.json();

  //emailElem.innerHTML = "Email: " + data.email;
  if (data.loggedIn == false) {
    window.location.href = 'http://localhost:3000/';
  }
}
async function getAccountDetails() {
  const response = await fetch('http://localhost:3000/api/account');
  const data = await response.json();

  emailElem.innerHTML = "Email: " + data.email;
  if (data.role == "admin") {
    passwordInput.style.display = "inline-block";
    passwordBtn.style.display = "inline-block";
    getUserAccounts();
  }else if (data.role == "user") {
      deleteBtn.style.display = "inline-block";
  }
}
async function logout() {
  const response = await fetch('http://localhost:3000/api/logout');
  window.location.href = 'http://localhost:3000/';
}
async function deleteAccount() {
  const response = await fetch('http://localhost:3000/api/delete');
  window.location.href = 'http://localhost:3000/';
}
async function getUserAccounts() {
  const response = await fetch('http://localhost:3000/api/user-account');
  const data = await response.json();

  console.log(data);
}
async function changePassword(newPassword) {
  console.log(newPassword);
  const response = await fetch('http://localhost:3000/api/change-password', {
    method: 'POST',
    body: JSON.stringify(newPassword),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();

  console.log(data);
}

passwordBtn.addEventListener('click', () => {
  if (passwordInput.value.length > 0) {
    let newPassword = {
      password: passwordInput.value
    }
    changePassword(newPassword);
  };
});

logoutBtn.addEventListener('click', () => {
  logout();
});

deleteBtn.addEventListener('click', () => {
  deleteAccount();
});


isLoggedIn();
getAccountDetails();
