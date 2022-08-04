const express = require('express');
const router = express.Router();

// GET REQUEST - HOMEPAGE
router.get('/', function(req, res) {
    res.sendFile('/public/index.html', { title: 'AdViz - Login' });

});


module.exports = router;