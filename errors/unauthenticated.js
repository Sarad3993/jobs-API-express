const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    // 401 --> UNAUTHORIZED
  }
}

module.exports = UnauthenticatedError;
