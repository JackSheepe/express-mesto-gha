class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandler = (err, req, res, next) => {
  let customError = { ...err };

  if (err.joi) {
    customError = new CustomError(400, "Ошибка валидации");
  }

  if (err.code === 11000) {
    customError = new CustomError(409, "Пользователь с таким Email уже существует");
  }

  if (err.name === "ValidationError") {
    customError = new CustomError(400, err.message);
  }

  res.status(customError.statusCode || 500).json({
    message: customError.message || "Server Error",
  });
};

module.exports = {
  CustomError,
  errorHandler,
};
