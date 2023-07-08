const express = require("express");

const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const cardIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required();

const cardCreateSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().pattern(/^https?:\/\/\w+(\.\w+)*(:\d+)?(\/.*)?$/).required(),
});

router.get("/", getAllCards);

router.post("/", celebrate({
  body: cardCreateSchema,
}), createCard);

router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: cardIdSchema,
  }),
}), deleteCard);

router.put("/:cardId/likes", likeCard);

router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
