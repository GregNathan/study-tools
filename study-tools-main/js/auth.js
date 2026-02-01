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

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[user]) {
    msg.textContent = "Wrong account.";
    return;
  }

  if (users[user] !== pass) {
    msg.textContent = "Wrong password.";
    return;
  }

  sessionStorage.setItem("authUser", user);
  localStorage.setItem("loggedInUser", user);

  // prevent going back to login
  window.location.replace("index.html");
}

// --- PROTECT PAGES ---
function requireLogin() {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    window.location.replace("login.html");
  }
}


// --- LOGOUT ---
function logout() {
  sessionStorage.removeItem("authUser");
  localStorage.removeItem("loggedInUser");

  // Clear history and force redirect
  window.location.replace("login.html");
}
// --- LOAD ACCOUNT INFO ---
function loadAccountInfo() {
  const user = localStorage.getItem("loggedInUser");
  document.getElementById("accountName").textContent = user;

  const records = JSON.parse(localStorage.getItem("activity_" + user)) || [];
  const list = document.getElementById("activityList");

  list.innerHTML = "";
  records.slice(-5).reverse().forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

// --- LOG ACTIVITY ---
function logActivity(action) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return;

  const key = "activity_" + user;
  const records = JSON.parse(localStorage.getItem(key)) || [];

  records.push(`${new Date().toLocaleString()} — ${action}`);
  localStorage.setItem(key, JSON.stringify(records));
}
