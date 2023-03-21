const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [6, 'Password must be more than 6 characters!']
    },
    lastName: {
        type:String,
        maxLength: 20,
        trim: true,
        default: 'Last Name'
    },
    location: {
        type:String,
        maxLength: 20,
        trim: true,
        default: 'My City'
    }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createToken = function () {
    return jwt.sign({ userID: this._id, username: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

const User = mongoose.model('User', userSchema);
module.exports = User