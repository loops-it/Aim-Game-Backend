module.exports = class validationException extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.code = 422;
    this.success = false;
    this.name = this.constructor.name;
    this.errors = message;
  }

  statusCode() {
    return this.code;
  }
};
