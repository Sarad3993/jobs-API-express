const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default (if error not gonna match any of the below conditions than run the default generic condition)
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    // *it means that if in the error object we have a property called statusCode then we will use that otherwise we will use the generic response  INTERNAL_SERVER_ERROR status code.

    msg: err.message || "Something went wrong, try again later",
    // *it means that if in the error object we have a property called message then we will use that otherwise we will use the generic response 'Something went wrong try again later'.
  };

  // * Mongoose Error Handling (Duplicate Value Entered)
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, Please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
    // * 400 --> Bad Request
  }
  // err.code --> 11000 is the error code for duplicate value entered in the database.
  // err.keyValue --> is the field in which the duplicate value is entered. In this case it is the email field.
  // and here we are doing this because we are not using the mongoose validators to check if the email is unique or not. We are doing this in the controller itself. So we have to handle the error here to use the custom error message.
  // * Object.keys() --> returns an array of the keys of the object i.e email in this case is the key of the object.


  // * Mongoose Error Handling (Validation Error)
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
    // here we checking if the error is a validation error or not. If it is a validation error then we are looping through the errors object and getting the message property of each error and joining them with a comma.
    // * Object.values() --> returns an array of the values of the object , and thus if it is array we can use map() method on it.
    // Object.entries() --> returns an array of the key value pairs of the object i.e [email, 'email is required'] in this case.
    // * map() --> is used to loop through the array and return the value of each item in the array.
    // * join() --> is used to join the array items with a comma.
  }


    // * Mongoose Error Handling (Cast Error)
    if (err.name === "CastError"){
      customError.msg = `No item found with id ${err.value}`;
      customError.statusCode = StatusCodes.NOT_FOUND;
      // * 404 --> Not Found
    } 


  return res.status(customError.statusCode).json({ msg: customError.msg });
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});

};


module.exports = errorHandlerMiddleware;