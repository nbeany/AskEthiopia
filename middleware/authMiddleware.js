const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication invalid' });
    }
    try {
       const data = jwt.verify(authHeader, process.env.JWT_SECRET);
       return res.status(StatusCodes.OK).json({msg:'Authentication successful', data });
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication invalid' });
    }
}
module.exports = authMiddleware;