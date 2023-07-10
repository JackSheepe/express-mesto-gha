const express = require("express");

const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const cardCreateSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().pattern(/^https?:\/\/\w+(\.\w+)*(:\d+)?(\/.*)?$/).required(),
});

const cardIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

router.get("/", getAllCards);

router.post("/", celebrate({
  body: cardCreateSchema,
}), createCard);

router.delete("/:cardId", cardIdValidator, deleteCard);

router.put("/:cardId/likes", cardIdValidator, likeCard);

router.delete("/:cardId/likes", cardIdValidator, dislikeCard);

module.exports = router;
