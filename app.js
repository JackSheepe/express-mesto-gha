const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { errors } = require("celebrate");
const { errorHandler } = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");
const {
  login,
  createUser,
} = require("./controllers/users");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res, next) => {
  res.status(404);

  if (req.accepts("html")) {
    return res.render("404", { url: req.url });
  }
  if (req.accepts("json")) {
    return res.json({ error: "Not found" });
  }
  return res.type("txt").send("Not found");
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
