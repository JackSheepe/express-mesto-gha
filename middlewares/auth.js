const jwt = require("jsonwebtoken");
const { CustomError } = require("./errorHandler");

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const customError = new CustomError(400, "Необходима авторизация");
    next(customError);
    return customError;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "6d7a0ce2469313600d7bf16c36f83a4f0a051ca3de3e327da75160cdc3eca245");
  } catch (err) {
    next(err);
  }

  req.user = payload;

  next();
  return;
};
