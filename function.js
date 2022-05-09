// Available User Logins
let admina = {
    username: "admina",
    password: "password",
    role:"admin"};
let normalo = {
    username: "normalo",
    password: "password",
    role:"normal"};
// User
let currentUser = {}
// Contacts


// After load up -> Only Login is visible
map = document.getElementById("map_container").style.display = "none";
addContactForm = document.getElementById("addContactForm").style.display = "none";
updateContactForm = document.getElementById("updateContactForm").style.display = "none";
let loginForm = document.getElementById("login");
let username = document.getElementById("usernameLabel");
let password = document.getElementById("passwordLabel");
let loginBtn = document.getElementById("loginBtn");
// Events

loginBtn.onclick = function() {

    let userValue = username.value;
    let passwordValue = password.value;

    if(userValue === "admina" && passwordValue === "password" || userValue === "normalo" && passwordValue === "password") {
        currentUser.name = userValue;
        currentUser.role = userValue === "admina" ? "admin" : "normal";
        loginForm.style.display = "none";
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("welcomeMessage").innerText = "Welcome, " + currentUser.name + ". Role: " + currentUser.role;
    }
}




