const express = require('express');
const router = express.Router();
const database = require('../database');


// Users POST Request for login
router.post('/', function(req, res) {
    const db = database.getDatabase().collection('users');

    const username = req.body.name;
    const password = req.body.password;
    console.log("Login attempt for user: " + username + " ...");
    if (!username || !password) {
        res.status(401).send("Error: Unauthorized (Invalid Login Information)");
    }
    else {
        db.findOne({name: username, password: password}, function(err, result) {
            if (err) {
                res.status(500).send("Error: Internal Server Error");
            }
            else if (!result) {
                res.status(401).send("Error: Unauthorized (Invalid Login Information)");
            }
            else {
                console.log("Login successful ... Sending response...")
                res.status(200).json({
                    name: result.name,
                    role: result.role
                })
            }
        }
        );
    }
});

module.exports = router;