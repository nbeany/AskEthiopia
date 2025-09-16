//db connection
const db = require('../db/dbconfige');
const bcrypt = require('bcryptjs');
const {StatusCodes} = require('http-status-codes');

async function register(req, res) {
   const { username, password, firstname, lastname, email } = req.body;
   if (!username || !password || !firstname || !lastname || !email) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields are required' });
   }
   try {
    const [user] = await db.query('SELECT username,userid FROM users WHERE username = ? or email = ?', [username, email]);
    if (user.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username or email already exists' });
    }
   if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character'
    });
}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid email format'
    });
}
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in the database
    await db.query('INSERT INTO users (username, password, firstname, lastname, email) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, firstname, lastname, email]);
    return res.status(StatusCodes.CREATED).json({ message: 'User registered successfully' });
   }
    catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
}
async function login(req, res) {
   const { email, password } = req.body;
   if (!email || !password) {
       return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email and password are required' });
   }
   try {
       const [user] = await db.query('SELECT username,userid, password FROM users WHERE email = ?', [email]);
       return res.status(StatusCodes.OK).json({ user: user });
    //    if (user.length == 0) {
    //        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid email or password' });
    //    }
      
   } catch (error) {
       console.log(error.message);
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
   }
}

async function check(req, res) {
    res.send('Check user');
    
}

module.exports = {
    register,
    login,
    check
};
