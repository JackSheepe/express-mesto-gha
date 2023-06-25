const Card = require("../models/card");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ error: err.message }));
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
    .then(() => res.send({ message: "Карточка удалена" }))
    .catch(() => res.status(404).send({ error: "Карточка не найдена" }));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ error: "Карточка не найдена" });
      }
      return res.send(card);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ error: "Карточка не найдена" });
      }
      return res.send(card);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
};
