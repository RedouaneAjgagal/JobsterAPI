const { StatusCodes } = require('http-status-codes')


const errorHandlerMiddleware = (err, req, res, next) => {

  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong..'
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Duplicate error, please enter a different ${Object.keys(err.keyValue)}`
  }
  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(err.errors).map(error => error.message).join(', ')
  }
  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = `No item has been found with id ${err.value}`
  }

  return res.status(customError.statusCode).json({ msg: customError.message })
  
}

module.exports = errorHandlerMiddleware
