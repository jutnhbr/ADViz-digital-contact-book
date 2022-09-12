import {User} from "/data/user.js";

let map;
let marker;
let markerList = [];
const identifier = ["firstName", "lastName", "street", "zipcode", "city", "country", "phone", "dateOfBirth"];

window.onload = async function () {
    // After load up -> Only Login screen is visible
    loadLoginScreen()
    hideAlert()
    await initMap();
}

// HTML Elements
let usernameField = document.getElementById("usernameLabel");
let passwordField = document.getElementById("passwordLabel");
let errorMessage = document.getElementById("loginErrorMessage");
let mapContainer = document.getElementById("map_container");
let addContactForm = document.getElementById("addContactForm");
let updateContactForm = document.getElementById("updateContactForm");
let welcomeMessageLabel = document.getElementsByClassName("headerWelcomeMessage")[0];
let alertBox = document.getElementById("alert");



// Current Username and Role
let currentUserInformation = new User();
//
let selectedContact;

// Inits the map screen
let initMap = async () => {
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: "AIzaSyBF0SvLTZkO3pThLmyHnkOrWLCBsWG3ikE",
        version: "weekly",
        libraries: ["drawing"]
    });
    loader.load().then(() => {
        map = new google.maps.Map(document.getElementById("mapFrame"), {
            center: {lat: 52.520008, lng: 13.404954},
            zoom: 15,
        });
    });
}

                                    // Events
/**
 * login event for the login form. Sends a POST request that checks if the username and password are correct
 * and if so, initializes the map screen loading and contact data loading.
 */
document.getElementById("loginBtn").onclick = async function () {

    let response = await fetch("/users", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: usernameField.value,
            password: passwordField.value
        })
    })
    if (response.status === 401) {
        usernameField.style.borderColor = "red";
        passwordField.style.borderColor = "red";
        errorMessage.innerText = await response.text();
    } else {
        let user = await response.json();
        if (loadMapScreen(user)) {
            await loadContacts(currentUserInformation, "user");
            usernameField.value = "";
            passwordField.value = "";
            displayAlert("Login successful");
            changeTitle("Map");
        }
    }
}
/**
 * Show all Contacts Button event. Shows all public contacts (or all contacts as an admin)
 */
document.getElementById("showAllContactsBtn").onclick = async function () {
    if (currentUserInformation.getRole() === "admin") {
        await loadContacts(currentUserInformation, "admin");
    } else if (currentUserInformation.getRole() === "normal") {
        await loadContacts(currentUserInformation, "allPublic");
    }
}

/**
 * Show own Contacts Button event. Shows all owned contacts
 */
document.getElementById("showMyContactsBtn").onclick = async function () {
    await loadContacts(currentUserInformation, "user");
}
/**
 * Back button event for the add contact form.
 */
document.getElementById("backButtonAdd").onclick = function(event) {
    event.preventDefault();
    changeDisplayedScreen("map_container", "addContactForm", "grid");
}
/**
 * Back button event for the update contact form.
 */
document.getElementById("backButtonUpdate").onclick = function(event) {
    event.preventDefault();
    changeDisplayedScreen("map_container", "updateContactForm", "grid");
    setCheckboxValue(document.querySelector('.privateCheckboxU:checked'), false);
}
/**
 * Add Contact Event -> Shows the Add Contact Form
 */
document.getElementById("addContactBtn").onclick = function (event) {
    event.preventDefault();
    changeDisplayedScreen("addContactForm", "map_container", "grid");

}
/**
 * // Add Contact Event -> Reads user input and calls addContact func
 */
document.getElementById("addButton").onclick = async function(event) {
    event.preventDefault();
    await addNewContact();

}
/**
 * // Delete Contact Event
 */
document.getElementById("deleteContactButton").onclick = async function(event) {
    event.preventDefault();
    await deleteContact(selectedContact);
    changeDisplayedScreen("map_container", "updateContactForm", "grid");
}
/**
 * // Closes the notification alert
 */
document.getElementById("notifyCloseButton").onclick = function(event) {
    event.preventDefault();
    hideAlert();
}
document.getElementsByClassName("logoutBtn")[0].onclick = function(event) {
    event.preventDefault();
    changeDisplayedScreen("login", "map_container", "grid");
    logout();
}
document.getElementsByClassName("headerButtons")[1].onclick = function(event) {
    event.preventDefault();
    displayAlert("Nothing to see here :)", "info");
}
document.getElementsByClassName("headerButtons")[2].onclick = function(event) {
    event.preventDefault();
    displayAlert("Nothing to see here :)", "info");
}

/**
 * // Update Contact Event
 */
document.getElementById("updateContactButton").onclick = async function(event) {
    event.preventDefault();
    await updateContact();
}

/**
 * Loads the map screen and sets the current user information. Hides the login screen and shows the map screen. Also sets
 * the welcome message.
 * @param userPOJO User Object received after successful login
 * @returns {boolean} Returns true if loading was successful
 */
let loadMapScreen = (userPOJO) => {
    currentUserInformation = new User(userPOJO.name, userPOJO.role);
    changeDisplayedScreen("map_container", "login", "grid");
    welcomeMessageLabel.innerHTML = "Welcome, " + currentUserInformation.getName() + ". Role: " + currentUserInformation.getRole();
    return true;
}

let loadedContacts = [];

let loadContacts = async (user, mode) => {

    let response;
    let userData = user.getName();

    response = await fetch("/contacts/?userData=" + userData + "&reqMode=" + mode, {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })

    if (response.status === 401) {
        errorMessage.innerText = await response.text();
    } else {
        loadedContacts = await response.json();
        clearList();
        clearMarkerList();
        loadedContacts.forEach(contact => {
            updateList(contact);
            addMarker(contact, contact["lat"], contact["lng"]);
        })
    }
}

/**
 * Inserts the data of the loaded contacts into the list.
 * @param contactEntry Contact Object received after loading the contacts
 */
let updateList = (contactEntry) => {
    let newEntry = document.createElement("LI");
    newEntry.classList.add('contactsListItem');
    newEntry.innerHTML = '<a href="#"><i class="fa-solid fa-address-card"></i> ' + contactEntry["firstName"] + " " + contactEntry["lastName"] + '</a>'
    document.getElementById("cList").appendChild(newEntry);

    // Adds onClickEvents for each item in the List
    let listItems  = document.querySelectorAll("#cList li");
    listItems.forEach(function(item) {
        item.onclick = function() {
            selectedContact = loadedContacts.find(o => o["firstName"] + " " + o["lastName"] === this.innerText);
            displayUpdateContactForm(selectedContact);
        }
    });
}

let clearList = () => {
    document.getElementById("cList").innerHTML = "";
}

let addMarker = (contact, lat, lng) => {

    marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        label: contact["firstName"] + " " + contact["lastName"]
    });

    markerList.push([contact,marker])

}
let removeMarker = (contact)=>{
    for (let i = 0; i < markerList.length ; i++) {
        if(markerList[i][0] === contact    ){
            markerList[i][1].setMap(null);
            markerList= markerList.filter(X=> X[0] !== contact);

        }
    }
}

let clearMarkerList = ()=>{
    for (let i = 0; i < markerList.length ; i++) {
        markerList[i][1].setMap(null);
    }
    markerList = [];
}

let addNewContact = async () => {

    let firstnameForm = document.getElementById("firstName");
    let lastnameForm = document.getElementById("lastName");
    let streetForm = document.getElementById("street");
    let zipcodeForm = document.getElementById("zipcode");
    let cityForm = document.getElementById("city");
    let countryForm = document.getElementById("country");
    let phoneForm = document.getElementById("phone");
    let dobForm = document.getElementById("dateOfBirth");
    let privateForm = document.querySelector('.privateCheckbox:checked')
    let errorLabel = document.getElementById("addContactErrorLabel");
    const requiredFields = [firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm];

    // Checks if all fields are filled out by the user
    if(!checkInput(firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm)) {
        // Returns true if checkbox was clicked, false if not
        let checked = privateForm != null;
        // Wait for coordinates from the API
        let latLng = await getCoordinates(streetForm.value, zipcodeForm.value, cityForm.value);
        // If address is not found, show error message
        if(latLng === false) {
            changeDisplayedScreen("map_container", "addContactForm", "grid");
            displayAlert("Could not find address. Please check your input!", "error");
        }
        else {
            let response = await fetch("/contacts", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    firstName: firstnameForm.value.replace(/\s+/g, ''),
                    lastName: lastnameForm.value.replace(/\s+/g, ''),
                    street: streetForm.value,
                    zipcode: zipcodeForm.value.replace(/\s+/g, ''),
                    city: cityForm.value,
                    country: countryForm.value,
                    phone: phoneForm.value.replace(/\s+/g, ''),
                    dateOfBirth: dobForm.value,
                    isPublic: checked,
                    owner: currentUserInformation.getName(),
                    lat: latLng.lat,
                    lng: latLng.lng
                })
            })
            if(response.status === 201) {
                changeDisplayedScreen("map_container", "addContactForm", "grid");
                await loadContacts(currentUserInformation, "user");
                // Clears input fields
                clearInput(requiredFields, updateContactForm, errorLabel);
                displayAlert("Contact added successfully", "success");
            }
            else {
                changeDisplayedScreen("map_container", "addContactForm", "grid");
                clearInput(requiredFields, updateContactForm, errorLabel);
                displayAlert(await response.text(), "error");
            }
        }
    }
    // If not all required fields are filled out, show error message
    else {
        errorLabel.innerText = "Please fill out all required fields!";
        requiredFields.forEach(element => {
            element.style.borderColor = "red";
        })
    }
}
/**
 * Deletes the selected contact from the database and the list. (Uses generated id)
 * @param contact Contact Object to be deleted
 */
let deleteContact = async (contact) => {
    let response = await fetch("/contacts/" + contact["_id"], {
        method: "DELETE"
    })
    if(response.status === 204) {
        await loadContacts(currentUserInformation, "user");
        displayAlert("Contact deleted successfully", "success");
    }
}


/**
 * Checks if required fields are filled out
 * @param firstnameForm first name input
 * @param lastnameForm last name input
 * @param streetForm street input
 * @param zipcodeForm zipcode input
 * @param cityForm city input
 * @returns {boolean} true if contains one or more empty fields
 */
let checkInput = (firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm) => {
    let fields = [
        firstnameForm.value,
        lastnameForm.value,
        streetForm.value,
        zipcodeForm.value,
        cityForm.value];
    return fields.includes("");
}

let getCoordinates = (street, zipcode, city) => {
    let lat;
    let lng;

    let url = "https://trueway-geocoding.p.rapidapi.com/Geocode?address=" + street + "%20" + zipcode + "%20" + city + "&language=de"
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
            'X-RapidAPI-Key': '6d4ee9038amshd48d6b7ff082733p15d30ajsnf3fbcf93f965'
        }
    }).then(response => response.json())
        .then(async response => {
            lat = await response.results[0].location["lat"]
            lng = await response.results[0].location["lng"]
            console.log("Received" + lat, lng)
            return {lat: lat, lng: lng}
        }).catch(async () => {
            return false
        });

}
// Resets Checkbox value
function setCheckboxValue(checkbox,value) {
    if(checkbox === null) return false;

    if (checkbox.checked!==value)
        checkbox.click();
}

let displayAlert = (message, mode) => {

    mode === "error" ? alertBox.children[0].style.color = "red" : alertBox.children[0].style.color = "green"
    alertBox.children[0].innerText = message;
    alertBox.style.display = "block";
}

let hideAlert = () => {
    alertBox.style.display = "none";
}

let logout = () => {
    currentUserInformation = null;
    loadedContacts = [];
    changeTitle("Login");
}

let loadLoginScreen = () => {
    mapContainer.style.display = "none";
    addContactForm.style.display = "none";
    updateContactForm.style.display = "none";
}

let displayUpdateContactForm = (ContactEntry) => {

    let deleteBtn = document.getElementById("deleteContactButton");
    let updateBtn = document.getElementById("updateContactButton");

    let inputFields = updateContactForm.elements
    for(let i = 0; i < 9; i++) {
        inputFields[i+1].value = ContactEntry[identifier[i]];
    }
    setCheckboxValue(inputFields[9], ContactEntry["isPublic"])
    // Hides the update and delete buttons when the user has no permission to update or delete the contact
    if(currentUserInformation.getRole() !== "admin" && ContactEntry["owner"]!==currentUserInformation.getName()) {
        deleteBtn.style.display = "none";
        updateBtn.style.display = "none";
    }
    else {
        deleteBtn.style.display = "inline";
        updateBtn.style.display = "inline";
    }
    changeDisplayedScreen("updateContactForm", "map_container", "grid");
}

let updateContact = async () => {

    let errorLabel = document.getElementById("updateContactErrorLabel");
    let firstnameUpdate = document.getElementById("firstNameU");
    let lastnameUpdate = document.getElementById("lastNameU");
    let streetUpdate = document.getElementById("streetU");
    let zipUpdate = document.getElementById("zipcodeU");
    let cityUpdate = document.getElementById("cityU");
    let checked = document.querySelector('.privateCheckboxU:checked');
    const requiredFields = [firstnameUpdate, lastnameUpdate, streetUpdate, zipUpdate, cityUpdate];
    let lat;
    let lng;

    if (!checkInput(firstnameUpdate, lastnameUpdate, streetUpdate, zipUpdate, cityUpdate)) {

        let latLng;

        // When the user enters a new address, new coordinates are requested
        if (selectedContact["street"] !== streetUpdate.value || selectedContact["zipcode"] !== zipUpdate.value || selectedContact["city"] !== cityUpdate.value) {
            latLng = await getCoordinates(streetUpdate.value, zipUpdate.value, cityUpdate.value);
            lat = latLng.lat;
            lng = latLng.lng;
        } else {
            // Old coordinates are used
            lat = selectedContact["lat"];
            lng = selectedContact["lng"];
        }
        if(latLng === false) {
            changeDisplayedScreen("map_container", "updateContactForm", "grid");
            clearInput(requiredFields, updateContactForm, errorLabel)
            displayAlert("Could not find address. Please check your input!", "error");
        }
        else {
            let response = await fetch("/contacts/" + selectedContact["_id"], {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    firstName: firstnameUpdate.value,
                    lastName: lastnameUpdate.value,
                    street: streetUpdate.value,
                    zipcode: zipUpdate.value,
                    city: cityUpdate.value,
                    country: updateContactForm.elements[6].value,
                    phone: updateContactForm.elements[7].value,
                    dateOfBirth: updateContactForm.elements[8].value,
                    isPublic: checked != null,
                    owner: currentUserInformation.getName(),
                    lat: lat,
                    lng: lng
                })});
            if (response.status === 204) {
                await loadContacts(currentUserInformation, "user");
                changeDisplayedScreen("map_container", "updateContactForm", "grid");
                displayAlert("Contact updated successfully", "success");
                clearInput(requiredFields, updateContactForm, errorLabel)
            } else {
                changeDisplayedScreen("map_container", "updateContactForm", "grid");
                await displayAlert("Error updating contact" + await response, "error");
                clearInput(requiredFields, updateContactForm, errorLabel)
            }
        }
    }
    else {
        errorLabel.innerText = "Please fill out all required fields!";
        requiredFields.forEach(element => {
            element.style.borderColor = "red";
        })
    }
}
/**
 * Resets a given input form
 * @param fields required fields
 * @param form form to be reset
 * @param errLabel error label
 */
let clearInput = (fields, form, errLabel) => {
    let inputFields = form.elements
    for(let i = 1; i < 9; i++) {
        inputFields[i].value = "";
    }
    setCheckboxValue(inputFields[9], false);
    // Resets Error Text
    errLabel.innerText = "";
    fields.forEach(element => {
        element.style.borderColor = "";
    })
}
/**
 * Changes the displayed screen to the given screen and hides the other screen.
 * @param screenToDisplay screen to be displayed
 * @param screenToHide current shown screen to be hidden
 * @param mode CSS display mode (grid, flex, block, none)
 */
let changeDisplayedScreen = (screenToDisplay, screenToHide, mode) => {
    document.getElementById(screenToHide).style.display = "none";
    document.getElementById(screenToDisplay).style.display = mode;
}

let changeTitle = (title) => {
    document.title = "AdViz | " + title;
}