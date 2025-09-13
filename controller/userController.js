//db connection
const db = require('../db/dbconfige');

async function register(req, res) {
   const { username, password, firstname, lastname, email } = req.body;
   if (!username || !password || !firstname || !lastname || !email) {
         return res.json({ message: 'All fields are required' });
   }
}
async function login(req, res) {
    res.send('Login user');
}

async function check(req, res) {
    res.send('Check user');
}

module.exports = {
    register,
    login,
    check
};
