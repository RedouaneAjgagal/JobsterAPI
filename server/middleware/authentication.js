const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Invalid Authentication')
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(payload.userID, 'name email _id');
        req.user = user
        // req.user = { userID: payload.userID, username: payload.username }
        next();
    } catch (error) {
        throw new UnauthenticatedError('Invalid Authentication')
    }
}

module.exports = auth;