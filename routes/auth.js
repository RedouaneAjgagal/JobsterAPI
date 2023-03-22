const express = require('express');
const router = express.Router();
const { login, register, updateUser } = require('../controllers/auth')
const authUser = require('../middleware/authentication');
const testUser = require('../middleware/testUser');
const rateLimiter = require('express-rate-limit');


const loginLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        msg: 'Too many requests from this IP, please try later'
    }
});

const createAccountLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        msg: 'Too many accounts created from this IP, please try again after an hour'
    }
})

router.route('/login')
    .post(loginLimiter, login);

router.route('/register')
    .post(createAccountLimiter, register);

router.route('/updateUser')
    .patch(authUser, testUser, updateUser)

module.exports = router