const express = require('express');
const router = express.Router();
const { login, register, updateUser } = require('../controllers/auth')
const authUser = require('../middleware/authentication');

router.route('/login')
    .post(login);



router.route('/register')
    .post(register);

router.route('/updateUser')
    .patch(authUser, updateUser)

module.exports = router