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

const updateUser = async (req, res) => {
    const { name, email, lastName, location } = req.body;
    if ((!name || name.trim().length < 1) || (!email || email.trim().length < 1) || (!lastName || lastName.trim().length < 1) || (!location || location.trim().length < 1)) {
        throw new BadRequestError('Please enter valid values');
    }
    const user = await User.findByIdAndUpdate(req.user.id, { name, email, lastName, location }, { runValidators: true, new: true });
    if (!user) {
        throw new BadRequestError('Cannot find a user')
    }
    const token = user.createToken();
    const updatedInfo = {
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        Location: user.location,
        token
    }
    res.status(StatusCodes.OK).json({ user: updatedInfo });
}

module.exports = {
    register,
    login,
    updateUser
}