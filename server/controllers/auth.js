const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const newUser = await User.create(req.body);
    const token = newUser.createToken();
    const userInfo = {
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        location: newUser.location,
        token
    }
    res.status(StatusCodes.CREATED).json({ user: userInfo });
}
const login = async (req, res) => {
    const { email, password } = req.body;
    if ((!email || email.trim().length === 0) || (!password || password.trim().length === 0)) {
        throw new BadRequestError('Please provide name and password');
    }
    // Check valid email
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Email or Password are invalid');
    }
    // Compare passwords
    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) {
        throw new UnauthenticatedError('Email or password are invalid');
    }

    const token = user.createToken();
    const userInfo = {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        token
    }
    res.status(StatusCodes.OK).json({ user: userInfo })
}

module.exports = {
    register,
    login
}