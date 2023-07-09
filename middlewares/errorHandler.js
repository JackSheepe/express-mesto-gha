class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  let customError = { ...err };

  if (err.code === 11000) {
    customError = new CustomError(409, "Пользователь с таким Email уже существует");
  }

  if (err.name === "ValidationError") {
    customError = new CustomError(400, err.message);
  }

  res.status(customError.statusCode || 500).json({
    message: customError.statusCode ? customError.message : "Server Error",
  });

  console.error(customError);
};

module.exports = {
  CustomError,
  errorHandler,
};
