// Create and Connect to the database
let database = connect('localhost:27017/adviz');

// Adding the 2 standard users
database.users.insertMany([
    {name: "admina", password: "password", role: "admin"},
    {name: "normalo", password: "password", role: "normal"}]);
// Adding the 4 standard contacts (2 for both users, one private and one public)
database.contacts.insertMany([
    // Admina
    {firstName: "Kevin", lastName: "Doe", street: "Treskowallee 8", zipcode: "10318", city: "Berlin",
        country: "Germany", phone: "353673437", dateOfBirth: "1990-01-01", owner: "admina", isPublic: true, lat: 52.493198, lng: 13.52591},
    {firstName: "Viviana", lastName: "Doe", street: "Gontermannstraße 78", zipcode: "12101", city: "Berlin",
        country: "Germany", phone: "6346345345345", dateOfBirth: "2005-06-21", owner: "admina", isPublic: false, lat: 52.475305, lng: 13.370906},
    // Normalo
    {firstName: "Dennis", lastName: "Doe", street: "Straße des 17. Juni 135", zipcode: "10623", city: "Berlin",
        country: "Germany", phone: "353637437", dateOfBirth: "1990-06-04", owner: "normalo", isPublic: true, lat: 52.512299, lng: 13.32697},
    {firstName: "Piet", lastName: "Doe", street: "Kaiserswerther Str. 16-18", zipcode: "14195", city: "Berlin",
        country: "Germany", phone: "88325652", dateOfBirth: "1990-06-04", owner: "normalo", isPublic: false, lat: 52.44796, lng: 13.28599}]);