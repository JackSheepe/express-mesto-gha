const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { errors } = require("celebrate");
const { CustomError, errorHandler } = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");
const {
  login,
  createUser,
} = require("./controllers/users");
const { createUserValidator, loginValidator } = require("./routes/users");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/signin", createUserValidator, login);
app.post("/signup", loginValidator, createUser);

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res, next) => {
  const customError = new CustomError(404, "Not found");
  next(customError);
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
