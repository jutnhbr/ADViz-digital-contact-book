/**
 * Adviz Server Class
 */

// Dependencies
const express = require('express');
const mongoDBClient = require('./database.js')
const connectionString = 'mongodb://localhost:27017/adviz';
// Routers
const homepageRouter = require('./routes/index');
const contactsRouter = require('./routes/contacts');
const usersRouter = require('./routes/users');
// Parser
const bodyParser = require('express');
// Initialize Express
const app = express();

// Static files
app.use(express.static(__dirname + '/public'));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
// Routes
app.use('/', homepageRouter);
app.use('/contacts', contactsRouter);
app.use('/users', usersRouter);


// Start the DB Connection and Server -> listen on port 3000
mongoDBClient.connectDB(connectionString, function(err) {
    if (err) {
        console.log('Error: Unable to connect to MongoDB.')
        process.exit(1)
    } else {
        app.listen(3000, function() {
            console.log('Server connection established! Listening on port 3000...')
        })
    }
})






