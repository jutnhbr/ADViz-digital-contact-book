# ADViz - Digital Contact-book

Student: Justin Steven Herbrich \
Matriculation Number: 577953 

### Description
AdViz is full Stack Web Application for a digital Contact-book with GeoCoding and Maps Implementation.
As a User you can create, edit, delete and search for Contacts, see them and their location on a Map. The Server provides 
several endpoints / HTTP requests for the User to interact with the Database.

There are 2 valid User logins: Admina (admin role) and Normalo (normal user role). Registration is not possible yet.
More information in the Installation Guide.
### Technologies
HTML, CSS, JavaScript, NodeJS, ExpressJS, MongoDB, GeoCoding, Google Maps API

# Dependencies / APIs / Frameworks

[NodeJS](https://nodejs.org/en/) \
[ExpressJS](https://expressjs.com/) \
[MongoDB](https://www.mongodb.com/) \
[Nodemon](https://nodemon.io/) \
[TrueWay GeoCoding](https://rapidapi.com/trueway/api/trueway-geocoding/) \
[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview) \
[Maps JS API Loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)

# How to Install and Use
Here is a simple step-by-step guide to install and try out ADViz locally
### 1. Code Checkout
### 2. Installation of Dependencies and packages
### 3. Creating the Database and importing needed data
### 4. Starting the Server
We use Nodemon to start the Server.
To start the Server you need to run the following command in the terminal:
```npm dev start```
This will run the Dev Script via Nodemon and also allows to automatically restart the Server when you change the code. 
If you wish to manually stop the server, press ```Strg+C``` in the terminal and enter ```Y```. If everything worked fine, 
you should see the following logs in the console:
```
Successfully connected to AdViz Database!
Server connection established! 
Listening on port 3000... 
```
### 5. Running the Application in your browser
Make sure you are using an up-to-date web browser. To open the application in your browser, open a new tab and enter the following URL:
```http://localhost:3000```. You should see the AdViz Login Page. The ```Register``` and ```Reset Password``` buttons are not yet functional.
To login, use one of the following credentials:
```
Username: admina Password: password // Admin Rights, can see all contacts and can edit or delete them.
Username: normalo Password: password // Normal User, can see all public contacts and can edit their own.
```
You can observe the process in the server console:
```
Login attempt for user: admina ...
Login successful ... Sending response...
```
After you have logged in, you should see the map screen with your own contacts shown on the left and on the map.
Switch the shown contacts by clicking on the corresponding buttons ```Show all contacts``` or ```Show my contacts```.
You can add new contacts by clicking the ```Add Contact``` button. Fill out all the fields and click the ```Save``` button.
(Not all fields are required, if some input is missing you will get notified).
# Troubleshooting