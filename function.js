import {User} from "/data/user.js";
import {ContactEntry} from "./data/contactEntry.js";

window.onload = function() {
    // After load up -> Only Login screen is visible
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("updateContactForm").style.display = "none";
}

// Available User Logins
let admina = new User("admina", "password", "admin");
let normalo = new User("normalo", "password", "normal")

let availableUsers = [admina, normalo];

// Current User
let currentUser = new User();

// Contacts
let contact1_admina = new ContactEntry("Unknown", "User(A)", "Street 55", "12101", "Berlin", "Germany", 353637437, "1990-06-04", "admina", true);
let contact2_admina = new ContactEntry("John", "Doe(A)", "Street 34", "53663", "Berlin", "Germany", 6436377, "1990-04-07", "admina", false);
let contact1_normalo = new ContactEntry("Dennis", "Doe(N)", "Street 14", "12101", "Berlin", "Germany", 353637437, "1990-06-04", "normalo", false);
let contact2_normalo = new ContactEntry("Piet", "Doe(N)", "Street 5", "63363", "Berlin", "Germany", 88325652, "1990-06-04", "normalo", true);

// Adding contacts to their user
admina.addContact(contact1_admina);
admina.addContact(contact2_admina);
normalo.addContact(contact1_normalo);
normalo.addContact(contact2_normalo);

// Forms 
let loginForm = document.getElementById("login");
let username = document.getElementById("usernameLabel");
let password = document.getElementById("passwordLabel");

// Events
document.getElementById("loginBtn").onclick = function() {

    let errorMessage = document.getElementById("loginErrorMessage");
    let error = "";

    let userValue = username.value;
    console.log("user" + userValue);
    let passwordValue = password.value;
    
    if(validateUser(userValue, passwordValue)) {
        loadContacts("my");
    }
    else if(!userValue && !passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Please enter your login details."
        errorMessage.innerText = error;
        username.style.borderColor = "red";
        password.style.borderColor = "red";
    }
    else if(userValue && !passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Password Field can't be empty!"
        errorMessage.innerText = error;
        password.style.borderColor = "red";
    }
    else if(!userValue && passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Username Field can't be empty!"
        errorMessage.innerText = error;
        username.style.borderColor = "red";
    }
    else {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Wrong Login Details."
        errorMessage.innerText = error;
        username.style.borderColor = "red";
        password.style.borderColor = "red";
    }
}

document.getElementById("addContactBtn").onclick = function () {
  // addContact(new ContactEntry("Yes", "No"));
}
// Loading all contacts
document.getElementById("showAllContactsBtn").onclick = function() {
    loadContacts("all");
}

// Loading contacts by user
document.getElementById("showMyContactsBtn").onclick = function() {
    loadContacts("my");
}


/**
 * Validates login data and initiates the contact list loading
 * @param user username
 * @param pass password
 * @returns {boolean} true if login was successful, false if not
 */
let validateUser = (user, pass) => {
    if(user === "admina" && pass === "password" || user === "normalo" && pass === "password") {
        currentUser = user ==="admina" ? admina : normalo;
        loginForm.style.display = "none";
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("welcomeMessage").innerText = "Welcome, " + currentUser.getName() + ". Role: " + currentUser.getRole();
        return true;
    }
    return false;
}

/**
 * Adds a contact to the list stored in the file
 * @param contactEntry new contact
 */
let addContact = (contactEntry) => {
    // contactList.push(contactEntry)
}


/**
 * Updates the HTML List based on the saved contacts data
 * @param contactEntry new contact
 */
let updateList = (contactEntry) => {
    let newEntry = document.createElement("LI");
    newEntry.innerHTML = '<a href="#"><i class="fa-solid fa-address-card"></i> ' + contactEntry.getFullName() + '</a>'
    document.getElementById("cList").appendChild(newEntry);
}

/**
 * Loads contacts based on the current user and the pressed button
 * @param mode my -> shows the users contacts after login and after pressing "show my contacts"
 *             all -> shows all contacts for admina, shows all public contacts for normalo
 */
let loadContacts = (mode) => {
    document.getElementById("cList").innerHTML = "";
    switch(mode) {
        case "my":
            for(let i = 0; i < currentUser.getContacts().length; i++) {
                if(currentUser.getContacts()[i].getOwner() === currentUser.getName()) {
                    updateList(currentUser.getContacts()[i]);
                }
            }
            break;
        case "all":
            if(currentUser.getRole() === "admin") {
                availableUsers.forEach(element => {
                    element.getContacts().forEach(element => {
                        updateList(element);
                    })
                });
            }
            break;
    }
}




