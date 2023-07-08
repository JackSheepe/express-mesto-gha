const { isValidObjectId } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CustomError } = require("../middlewares/errorHandler");
const User = require("../models/user");

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    const customError = new CustomError(400, "Неверный формат _id");
    return Promise.reject(customError);
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new CustomError(404, "Пользователь по указанному _id не найден");
      }
      return res.status(200).json(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userData = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(201).send(userData);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new CustomError(404, "Пользователь с указанным _id не найден");
      }
      const userData = {
        name: user.name,
        about: user.about,
      };
      return res.status(200).json(userData);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new CustomError(404, "Пользователь с указанным _id не найден");
      }
      const userData = {
        avatar: user.avatar,
      };
      return res.status(200).json(userData);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "6d7a0ce2469313600d7bf16c36f83a4f0a051ca3de3e327da75160cdc3eca245", { expiresIn: "7d" });
      res.send({
        token,
      });

      res
        .cookie("jwt", token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        });
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new CustomError(404, "Пользователь не найден");
      }
      return res.send(user);
    })
    .catch(next);
};
