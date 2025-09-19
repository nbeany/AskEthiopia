const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication invalid' });
    }
    try {
       const { userid, username } = jwt.verify(authHeader, process.env.JWT_SECRET);
         req.user = { userid, username };
    next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication invalid' });
    }
}
module.exports = authMiddleware;