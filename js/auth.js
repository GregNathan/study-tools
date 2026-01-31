// --- DATABASE (localStorage) ---
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// --- SIGN UP ---
function signup() {
  const user = document.getElementById("signupUser").value.trim();
  const pass = document.getElementById("signupPass").value.trim();
  const msg = document.getElementById("msg");

  if (!user || !pass) {
    msg.textContent = "Please fill in all fields.";
    return;
  }

  const users = getUsers();

  if (users[user]) {
    msg.textContent = "Account already exists.";
    return;
  }

  users[user] = pass;
  saveUsers(users);

  msg.textContent = "Account created! Redirecting to login...";
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}

// --- LOGIN ---
function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const msg = document.getElementById("msg");

  const users = getUsers();

  if (!users[user]) {
    msg.textContent = "Wrong account.";
    return;
  }

  if (users[user] !== pass) {
    msg.textContent = "Wrong password.";
    return;
  }

  localStorage.setItem("loggedInUser", user);
  window.location.href = "index.html";
}

// --- PROTECT PAGES ---
function requireLogin() {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    window.location.href = "esignup.html";
  }
}

// --- LOGOUT ---
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
