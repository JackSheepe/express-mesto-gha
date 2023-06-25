const User = require("../models/user");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(401).send({ message: "Произошла ошибка" }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ message: "Запрашиваемый пользователь не найден" });
      }
      return res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).send({ message: "Произошла ошибка" });
      throw error;
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
      return res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.updateProfile = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
