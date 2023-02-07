const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    // set default(if error not gonna match any of the below conditions than run this default)
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    // *it means that if in the error object we have a property called statusCode then we will use that otherwise we will use the generic response  INTERNAL_SERVER_ERROR status code.

    message: err.message || 'Something went wrong, try again later'
    // *it means that if in the error object we have a property called message then we will use that otherwise we will use the generic response 'Something went wrong try again later'.
  };


  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  // * is this code necessary? or I can remove it? 
  // Yes, this is necessary because we are using this middleware for all the routes. So if we don't have this condition then the custom error message will not be sent to the client. It will send the generic error message. 
  // So we are checking if the error is an instance of CustomAPIError then we are sending the custom error message to the client.
  // If the error is not an instance of CustomAPIError then we are sending the generic error message to the client.
  

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, Please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
    // * 400 --> Bad Request
  }
  // err.code --> 11000 is the error code for duplicate value entered in the database. 
  // err.keyValue --> is the field in which the duplicate value is entered. In this case it is the email field. 
  // and here we are doing this because we are not using the mongoose validators to check if the email is unique or not. We are doing this in the controller itself. So we have to handle the error here to use the custom error message.

  return res.status(customError.statusCode).json({ msg: customError.msg });
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err})

};

module.exports = errorHandlerMiddleware;
