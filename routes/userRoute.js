const express = require('express');
const router = express.Router();

// import user controller functions
const { register, login, check } = require('../controller/userController');


// register route
router.post('/register', register);

// login route
router.post('/login', login);

// check user
router.get('/check', check);


module.exports = router;