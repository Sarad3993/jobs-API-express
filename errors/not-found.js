const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statuCode = StatusCodes.NOT_FOUND;
    // 404 --> NOT_FOUND
  }
}

module.exports = NotFoundError;
