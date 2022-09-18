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

[NodeJS](https://nodejs.org/en/), 
[ExpressJS](https://expressjs.com/), 
[MongoDB](https://www.mongodb.com/),
[Nodemon](https://nodemon.io/),
[TrueWay GeoCoding](https://rapidapi.com/trueway/api/trueway-geocoding/),
[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview),
[Maps JS API Loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)

# How to Install and Use
Here is a simple step-by-step guide to install and try out ADViz locally
### 0. Prerequisites
Make sure you have ````NodeJS, MongoDB and MongoShell```` installed on your machine. If not, please refer to the links above 
and follow the tutorials for your OS.
If you wish, you can also use ````MongoDB Compass````, a GUI for MongoDB.

#### PLEASE NOTE: There might be differences in the commands for different versions of NodeJS and MongoDB.

### 1. Code Checkout
At first, you need to check out the repository. Open a terminal or Git CLI and navigate to a directory where you want to install ADViz
and run the following command:
```bash
git clone https://github.com/jutnhbr/biri_justin-WAD2022.git
```
Or using the commit hash: 
```bash
git clone `URLTORepository`
cd `into your cloned folder`
git checkout commithash
```
### 2. Installation of Dependencies and packages
Open up the cloned repository in your favorite code editor and run the following command in your terminal:
```bash 
npm install
``` 
Make sure to take a look at the index.html file in /public/index.html and check
if the IDE asks you to install additional ```UNPKG packages``` like the Font Awesome Script and the Maps JavaScript API Loader which is needed to load the Google Maps API.

### 3. Creating the Database and importing needed data
You need a local ```MongoDB``` instance and ```MongoSh``` to run ADViz. Make sure everything is properly installed. 

If MongoDB is not running as a service / daemon on your machine, you can start it with the following command:
```mongod --dbpath *PATH TO YOUR DB/DATA FOLDER*``` (Check the MongoDB documentation for more details)

If the local MongoDB instance is running, you can open a new terminal and navigate to the folder where you cloned the repository
and execute the init script:
```mongosh localhost:27017/adviz initDB.js ```
#### PLEASE NOTE: If you are using MongoDB below Version 6.0, you have to use ```mongo``` instead of ```mongosh```.

Now the database should be created and the needed collections should be filled with data. 

### 4. Starting the Server
We use Nodemon to start the Server. This also automatically restarts the server if you make changes to the code.
To start the Server you need to run the following command in the terminal:  
```npm run dev```

If you wish to manually stop the server, press ```Strg+C```. If everything worked fine, 
you should see the following logs in the server console:
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

# Troubleshooting
- If the map or the markers are not shown, make sure you have installed the Maps JavaScript API Loader UNPKG package as mentioned above
- If you are using a different port than 27017, you have to change the port in the ```initDB.js``` script.
- The Map might have a "Developer Mode" watermark. This is normal due to the API Key restrictions. You can replace the API Key in the ```index.html``` file with your own key if needed. The map should still work though.
- If you cant login, make sure you have created the database and imported the data using the script. If you are using MongoDB Compass, you can see the data in the Compass GUI. Alternatively, you can use the ```mongo (below 6.0)``` or ```mongosh (6.0+)``` shell commands to check if the data is there.