const { BadRequestError } = require('../errors')

const testUser = (req, res, next) => {
    if (req.user.isTestUser) {
        throw new BadRequestError('Test User. Read Only!')
    }
    next()
}

module.exports = testUser;