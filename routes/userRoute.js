const express = require('express');
const router = express.Router();


// register route
router.post('/register', (req, res) => {
    res.send('Register user');
});
// login route
router.post('/login', (req, res) => {
    res.send('Login user');
});
// check user
router.get('/check', (req, res) => {
    res.send('Check user');
});

module.exports = router;