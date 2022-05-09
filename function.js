window.onload = function() {
    // After load up -> Only Login is visible
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("updateContactForm").style.display = "none";
    
 

    
}
// Available User Logins
let admina = {
    username: "admina",
    password: "password",
    role:"admin"};
let normalo = {
    username: "normalo",
    password: "password",
    role:"normal"};
// Current User
let currentUser = {};

// Contacts
let contact1forAdmina = {
    name: "Unknown",
    lastname: "User(A)", 
    street: "Street 55", 
    zipcode: "12101", 
    city: "Berlin", 
    country: "Germany", 
    phone: 353637437, 
    dateOfBirth: "1990-06-04", 
    owner: "admina",
    public: false,
    getFullName: function() {
        return this.name + " " + this.lastname;
    }
};

let contact2forAdmina = {
    name: "John",
    lastname: "Doe(A)",
    street: "Test 55",
    zipcode: "12101",
    city: "Berlin",
    country: "Germany",
    phone: 15453535,
    dateOfBirth: "1990-04-03",
    owner: "admina",
    public: true,
    getFullName: function() {
        return this.name + " " + this.lastname;
    }
};

let contact1forNormalo = {
    name: "Dennis",
    lastname: "Doe(N)",
    street: "Test 55",
    zipcode: "12101",
    city: "Berlin",
    country: "Germany",
    phone: 15453535,
    dateOfBirth: "1990-04-03",
    owner: "normalo",
    public: false,
    getFullName: function() {
        return this.name + " " + this.lastname;
    }
};

let contact2forNormalo = {
    name: "Piet",
    lastname: "Ark(N)",
    street: "Test 55",
    zipcode: "12101",
    city: "Berlin",
    country: "Germany",
    phone: 15453535,
    dateOfBirth: "1990-04-03",
    owner: "normalo",
    public: true,
    getFullName: function() {
        return this.name + " " + this.lastname;
    }
};


let contactList = [contact1forAdmina, contact2forAdmina, contact1forNormalo, contact2forNormalo];


// Forms 
let loginForm = document.getElementById("login");
let username = document.getElementById("usernameLabel");
let password = document.getElementById("passwordLabel");

// Events
document.getElementById("loginBtn").onclick = function() {

    let userValue = username.value;
    let passwordValue = password.value;
    
    if(validateUser(userValue, passwordValue)) {
        loadContacts(currentUser, "my");
    }
}

document.getElementById("addContactBtn").onclick = function () {
  // addContact(test);
}

document.getElementById("showAllContactsBtn").onclick = function() {
    loadContacts(currentUser, "all");
}

document.getElementById("showMyContactsBtn").onclick = function() {
    loadContacts(currentUser, "my");
}

/**
 * Validates login data and initiates the contact list loading
 * @param user username
 * @param pass password
 * @returns {boolean} true if login was successful, false if not
 */
let validateUser = (user, pass) => {
    if(user === "admina" && pass === "password" || user === "normalo" && pass === "password") {
        currentUser.name = user;
        currentUser.role = user === "admina" ? "admin" : "normal";
        loginForm.style.display = "none";
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("welcomeMessage").innerText = "Welcome, " + currentUser.name + ". Role: " + currentUser.role;
        return true;
    }
    return false;
}

/**
 * Adds a contact to the list stored in the file
 * @param contact new contact
 */
let addContact = (contact) => {
    contactList.push(contact)
}


/**
 * Updates the HTML List based on the saved contacts data
 * @param contact new contact
 */
let updateList = (contact) => {
    let newEntry = document.createElement("LI");
    newEntry.innerHTML = '<a href="#"><i class="fa-solid fa-address-card"></i> ' + contact.getFullName() + '</a>'
    document.getElementById("cList").appendChild(newEntry);
}

/**
 * Loads contacts based on the current user and the pressed button
 * @param user current user -> admina or normalo
 * @param mode my -> shows the users contacts after login and after pressing "show my contacts"
 *             all -> shows all contacts for admina, shows all public contacts for normalo
 */
let loadContacts = (user, mode) => {
    document.getElementById("cList").innerHTML = "";
    switch(mode) {
        case "my":
            for(let i = 0; i < contactList.length; i++) {
                if(contactList[i].owner === user.name) {
                    updateList(contactList[i]);
                }
            }
            break;
        case "all":
            for(let i = 0; i < contactList.length; i++) {
                if(user.name === "admina") {
                    updateList(contactList[i]);
                }
            }
            break;
    }
}




