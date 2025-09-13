//db connection
const db = require('../db/dbconfige');
const bcrypt = require('bcryptjs');

async function register(req, res) {
   const { username, password, firstname, lastname, email } = req.body;
   if (!username || !password || !firstname || !lastname || !email) {
         return res.status(400).json({ message: 'All fields are required' });
   }
   try {
    const [user] = await db.query('SELECT username,userid FROM users WHERE username = ? or email = ?', [username, email]);
    if (user.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }
   if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character'
    });
}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
        message: 'Invalid email format'
    });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store user in the database



    await db.query('INSERT INTO users (username, password, firstname, lastname, email) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, firstname, lastname, email]);
    return res.status(201).json({ message: 'User registered successfully' });
   }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Server error' });
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
