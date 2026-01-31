// Get stored users
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

// Save users
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// SIGN UP
function signup() {
  const user = document.getElementById("signupUser").value;
  const pass = document.getElementById("signupPass").value;
  const msg = document.getElementById("msg");

  if (!user || !pass) {
    msg.innerText = "Fill all fields";
    return;
  }

  let users = getUsers();

  if (users[user]) {
    msg.innerText = "Account already exists";
    return;
  }

  users[user] = pass;
  saveUsers(users);

  msg.innerText = "Account created! Redirecting...";
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}

// LOGIN
function login() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;
  const msg = document.getElementById("msg");

  let users = getUsers();

  if (!users[user]) {
    msg.innerText = "Wrong account";
    return;
  }

  if (users[user] !== pass) {
    msg.innerText = "Wrong password";
    return;
  }

  localStorage.setItem("loggedInUser", user);
  window.location.href = "index.html";
}

// CHECK LOGIN
function checkLogin() {
  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("user").innerText =
      "Logged in as: " + user;
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
