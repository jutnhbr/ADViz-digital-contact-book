const express = require('express');
const router = express.Router();
const database = require('../database');
const querystring = require('querystring');





router.post('/', function(req, res) {
    const db = database.getDatabase().collection('contacts');
    console.log("Creating new contact " + req.body.firstName + " " + req.body.lastName + "...");
    db.insertOne(req.body, function(err, result) {
        if (err) {
            res.status(500).send("Error: Internal Server Error");
        }
        else {
            console.log("Contact created successfully...")
            res.status(201).json(result);
        }
    });
});



router.get('/', function(req, res) {
    const db = database.getDatabase().collection('contacts');

    // Request URL parameters
    let userData = req.query.userData
    let requestMode = req.query.reqMode

    console.log("Get request for contacts for user: " + userData + " ... Mode: " + requestMode);

    // Read all contacts
    if (requestMode === "admin") {
        db.find({}).toArray(function(err, result) {
            if (err) {
                res.status(500).send("Error: Internal Server Error");
            }
            else {
                res.status(200).json(result);
            }
        }
        );
    }
    // Read all public contacts
    else if(requestMode === "allPublic") {
        db.find({isPublic: true}).toArray(function(err, result) {
            if (err) {
                res.status(500).send("Error: Internal Server Error");
            }
            else {
                res.status(200).json(result);
            }
        }
        );

    }
    // Read all contacts for a specific user
    else if(requestMode === "user") {
        db.find({owner: userData}).toArray(function(err, result) {
            if (err) {
                res.status(500).send("Error: Internal Server Error");
            }
            else {
                res.status(200).json(result);
                console.log("Returning User data")
            }
        }
        );
    }
});







module.exports = router;