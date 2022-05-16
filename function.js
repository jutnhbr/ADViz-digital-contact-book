import {User} from "/data/user.js";
import {ContactEntry} from "./data/contactEntry.js";

window.onload = function() {
    // After load up -> Only Login screen is visible
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("updateContactForm").style.display = "none";
}

// Available User Logins (Hardcoded)
let admina = new User("admina", "password", "admin");
let normalo = new User("normalo", "password", "normal")

let availableUsers = [admina, normalo];

// Current User (overwritten after login)
let currentUser = new User();

// Contacts (Hardcoded)
let contact1_admina = new ContactEntry("Unknown", "User(A)", "Street 55", "12101", "Berlin", "Germany", 353637437, "1990-06-04",  true);
let contact2_admina = new ContactEntry("John", "Doe(A)", "Street 34", "53663", "Berlin", "Germany", 6436377, "1990-04-07", false );
let contact1_normalo = new ContactEntry("Dennis", "Doe(N)", "Street 14", "12101", "Berlin", "Germany", 353637437, "1990-06-04", true);
let contact2_normalo = new ContactEntry("Piet", "Doe(N)", "Street 5", "63363", "Berlin", "Germany", 88325652, "1990-06-04",true);

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
    let passwordValue = password.value;
    
    if(validateUser(userValue, passwordValue)) {
        changeTitle("Adviz | Home");
        loadContacts("my");
    }
    // Possible error cases
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
// Add Contact Event -> Shows the Add Contact Form
document.getElementById("addContactBtn").onclick = function (event) {
    event.preventDefault();
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "grid";
    changeTitle("Adviz | Add Contact")

    
}
// Add Contact Event -> Reads user input and calls addContact func
document.getElementById("addButton").onclick = function(event) {
    event.preventDefault();

    let firstnameForm = document.getElementById("firstName");
    let lastnameForm = document.getElementById("lastName");
    let streetForm = document.getElementById("streetAndNumber");
    let zipcodeForm = document.getElementById("zipcode");
    let cityForm = document.getElementById("city");
    let countryForm = document.getElementById("country");
    let phoneForm = document.getElementById("phone");
    let dobForm = document.getElementById("dob");
    let privateForm = document.querySelector('.privateCheckbox:checked')

    // Returns true if checkbox was clicked, false if not
    let checked = privateForm != null;
    // Created new Entry
    let newEntry = new ContactEntry(
        firstnameForm.value,
        lastnameForm.value,
        streetForm.value,
        zipcodeForm.value,
        cityForm.value,
        countryForm.value,
        phoneForm.value,
        dobForm.value,
        checked
    );

    // Adds the new entry
    addContact(newEntry);

    // Hides Form and displays the map again
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("addContactForm").style.display = "none";
    
    // Clears input
    firstnameForm.value = "";
    lastnameForm.value = "";
    streetForm.value = "";
    zipcodeForm.value = "";
    cityForm.value = "";
    countryForm.value = "";
    phoneForm.value = "";
    dobForm.value = "";
    setCheckboxValue(privateForm, false);
}

// Resets Checkbox value 
function setCheckboxValue(checkbox,value) {
    if(checkbox === null) return false;

    if (checkbox.checked!==value)
        checkbox.click();
}

// Loading all contacts
document.getElementById("showAllContactsBtn").onclick = function() {
    loadContacts("all");
}

// Loading contacts by user
document.getElementById("showMyContactsBtn").onclick = function() {
    loadContacts("my");
}

document.getElementById("backButtonAdd").onclick = function(event) {
    event.preventDefault();
    changeTitle("Adviz | Home")
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("addContactForm").style.display = "none";
}
document.getElementById("backButtonUpdate").onclick = function(event) {
    event.preventDefault();
    changeTitle("Adviz | Home")
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("updateContactForm").style.display = "none";

    setCheckboxValue(document.querySelector('.privateCheckboxU:checked'), false);
}





/**
 * Validates login data and initiates the contact list loading
 * @param user username
 * @param pass password
 * @returns {boolean} true if login was successful, false if not
 */
let validateUser = (user, pass) => {
    if(user === "admina" && pass === "password" || user === "normalo" && pass === "password") {
        currentUser = user === "admina" ? admina : normalo;
        loginForm.style.display = "none";
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("welcomeMessage").innerText = "Welcome, " + currentUser.getName() + ". Role: " + currentUser.getRole();
        return true;
    }
    return false;
}

/**
 * Adds a contact to the users contacts and reloads the contact list
 * @param ContactEntry new contact
 */
let addContact = (ContactEntry) => {
    currentUser.addContact(ContactEntry);
    loadContacts("my");
}

// TODO: get geo coords from webservice


/**
 * Updates the HTML List based on the saved contacts data
 * @param contactEntry new contact
 */
let updateList = (contactEntry) => {
    let newEntry = document.createElement("LI");
    newEntry.classList.add('contactsListItem');
    newEntry.innerHTML = '<a href="#"><i class="fa-solid fa-address-card"></i> ' + contactEntry.getFullName() + '</a>'
    document.getElementById("cList").appendChild(newEntry);



    // Adds onClickEvents for each item in the List
    let listItems  = document.querySelectorAll("ul li");
    listItems.forEach(function(item) {
        item.onclick = function() {
             let savedUser = currentUser.getContacts().find(o => o.getFullName() === this.innerText);
             updateContact(savedUser);
        }
    });
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
                    updateList(currentUser.getContacts()[i]);
            }
            break;
        case "all":
            if(currentUser.getRole() === "admin") {
                availableUsers.forEach(element => {
                    element.getContacts().forEach(element => {
                        updateList(element);
                    })
                });
                // TODO: Case for normalo
            }
            break;
    }
    changeTitle("Adviz | Home")
}

let updateContact = (ContactEntry) => {

    changeTitle("Adviz | Update Contact")

    document.getElementById("map_container").style.display = "none";
    document.getElementById("updateContactForm").style.display = "grid";
    // Showing data
    document.getElementById("firstNameU").value = ContactEntry.getName();
    document.getElementById("lastNameU").value = ContactEntry.getLastname();
    document.getElementById("streetAndNumberU").value = ContactEntry.getStreet();
    document.getElementById("zipcodeU").value = ContactEntry.getZipcode();
    document.getElementById("cityU").value = ContactEntry.getCity();
    document.getElementById("countryU").value = ContactEntry.getCountry();
    document.getElementById("phoneU").value = ContactEntry.getPhone();
    document.getElementById("dobU").value = ContactEntry.getDateOfBirth();
    let box = document.getElementById("privateU")
    if(ContactEntry.isPublic()) {
        setCheckboxValue(box, ContactEntry.isPublic());
    }
}

let changeTitle = (title) => {
    document.getElementById("title").innerText = title;
}


