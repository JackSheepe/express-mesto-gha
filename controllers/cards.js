const Card = require("../models/card");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ error: "Переданы некорректные данные" });
      }
      return res.status(500).send({ error: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => res.status(400).send({ error: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(404).send({ error: "Карточка с указанным _id не найдена" });
      }
      return res.send({ message: "Карточка удалена" });
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).send({ error: "Передан несуществующий _id карточки" });
      }
      return res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ error: "Переданы некорректные данные для постановки лайка" });
      }
      return res.status(500).send({ error: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).send({ error: "Передан несуществующий _id карточки" });
      }
      return res.send(updatedCard);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ error: "Переданы некорректные данные для снятия лайка" });
      }
      return res.status(500).send({ error: err.message });
    });
};
