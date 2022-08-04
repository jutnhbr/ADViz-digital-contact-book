import {User} from "/data/user.js";

let map;
let marker;
let markerList = [];

window.onload = async function () {
    // After load up -> Only Login screen is visible
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("updateContactForm").style.display = "none";
    await initMap();

}

// HTML Elements
let usernameField = document.getElementById("usernameLabel");
let passwordField = document.getElementById("passwordLabel");
let loginForm = document.getElementById("login");
let errorMessage = document.getElementById("loginErrorMessage");
// Current Username and Role
let currentUserInformation = new User();

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
            await loadContacts(currentUserInformation, "user")
        }
    }
}
/**
 * Show all Contacts Button event. Shows all public contacts (or all contacts as an admin)
 */
document.getElementById("showAllContactsBtn").onclick = function() {
    if(currentUserInformation.getRole() === "admin") {
        loadContacts(currentUserInformation, "admin");
    }
    else if(currentUserInformation.getRole() === "normal") {
        loadContacts(currentUserInformation, "allPublic");
    }
}

/**
 * Show own Contacts Button event. Shows all owned contacts
 */
document.getElementById("showMyContactsBtn").onclick = function() {
    loadContacts(currentUserInformation, "user");
}
/**
 * Back button event for the add contact form.
 */
document.getElementById("backButtonAdd").onclick = function(event) {
    event.preventDefault();
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("addContactForm").style.display = "none";
}
/**
 * Back button event for the update contact form.
 */
document.getElementById("backButtonUpdate").onclick = function(event) {
    event.preventDefault();
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("updateContactForm").style.display = "none";

    setCheckboxValue(document.querySelector('.privateCheckboxU:checked'), false);
}
/**
 * Add Contact Event -> Shows the Add Contact Form
 */
document.getElementById("addContactBtn").onclick = function (event) {
    event.preventDefault();
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "grid";

}
/**
 * // Add Contact Event -> Reads user input and calls addContact func
 */
document.getElementById("addButton").onclick = async function(event) {
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
    let errorLabel = document.getElementById("addContactErrorLabel");
    const requiredFields = [firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm];
    // Checks if all fields are filled out by the user
    if(!checkInput(firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm)) {
        // Returns true if checkbox was clicked, false if not
        let checked = privateForm != null;

        let latLng = await getCoordinates(streetForm.value, zipcodeForm.value, cityForm.value);
        console.log("Before add" + latLng);

        let response = await fetch("/contacts", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstName: firstnameForm.value,
                lastName: lastnameForm.value,
                street: streetForm.value,
                zipcode: zipcodeForm.value,
                city: cityForm.value,
                country: countryForm.value,
                phone: phoneForm.value,
                dob: dobForm.value,
                isPublic: checked,
                owner: currentUserInformation.getName(),
                lat: latLng.lat,
                lng: latLng.lng
            })
        })
        if(response.status === 201) {
            errorLabel.innerText = "Contact added successfully";
            errorLabel.style.color = "green";
            document.getElementById("map_container").style.display = "grid";
            document.getElementById("addContactForm").style.display = "none";
            await loadContacts(currentUserInformation, "user");
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
            // Resets Error Text
            errorLabel.innerText = "";
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
 * Loads the map screen and sets the current user information. Hides the login screen and shows the map screen. Also sets
 * the welcome message.
 * @param userPOJO User Object received after successful login
 * @returns {boolean} Returns true if loading was successful
 */
let loadMapScreen = (userPOJO) => {
    currentUserInformation = new User(userPOJO.name, userPOJO.role);
    loginForm.style.display = "none";
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("welcomeMessage").innerText = "Welcome, " + currentUserInformation.getName() + ". Role: " + currentUserInformation.getRole();
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
        }).catch(async err => {
            alert(err);
            return false
        });

}
// Resets Checkbox value
function setCheckboxValue(checkbox,value) {
    if(checkbox === null) return false;

    if (checkbox.checked!==value)
        checkbox.click();
}