const express = require('express');
const router = express.Router();
const { login, register, updateUser } = require('../controllers/auth')
const authUser = require('../middleware/authentication');
const testUser = require('../middleware/testUser');

router.route('/login')
    .post(login);



router.route('/register')
    .post(register);

router.route('/updateUser')
    .patch(authUser, testUser, updateUser)

module.exports = router