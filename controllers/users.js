const User = require("../models/user");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ message: "Success", data: users }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(401)
          .send({ message: "Переданы некорректные данные", error: err.message });
      }
      return res.status(500).send({ message: "Server Error", error: err.message });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "Пользователь по указанному _id не найден" });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ error: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};
