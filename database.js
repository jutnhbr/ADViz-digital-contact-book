/**
 * Global adviz database object. Gets initialized after the server is started. Can be used by any logger or router.
 * @type {MongoClient}
 */

const MongoClient = require('mongodb').MongoClient;

// global state for mongodb
let state = {
    database: undefined
};

exports.connectDB = function(url, done) {
    if (state.database) return done()

    MongoClient.connect(url, function(err, db) {
        if (err) return done(err)
        state.database = db.db("adviz");
        console.log("Successfully connected to AdViz Database!")
        done()
    })
}

exports.getDatabase = function() {
    return state.database
}

exports.closeConnection = function(done) {
    if (state.database) {
        state.database.close(function(err, result) {
            state.database = null
            state.mode = null
            console.log("Closing connection to Adviz Database...")
            done(err)
        })
    }
}

module.exports = exports;