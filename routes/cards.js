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

// Object Id validation schema (using regular expression literal)
const cardIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required();

// Card create validation schema
const cardCreateSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().uri().required(),
});

// Likes update validation schema
const cardLikesSchema = Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).default([]);

router.get("/", getAllCards);

router.post("/", celebrate({
  body: cardCreateSchema,
}), createCard);

router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: cardIdSchema,
  }),
}), deleteCard);

router.put("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: cardIdSchema,
  }),
  body: cardLikesSchema,
}), likeCard);

router.delete("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: cardIdSchema,
  }),
  body: cardLikesSchema,
}), dislikeCard);

module.exports = router;
