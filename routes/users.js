const express = require("express");

const { celebrate, Joi } = require("celebrate");

const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserMe,
} = require("../controllers/users");

const userIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required();

const userUpdateSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
});

const avatarUpdateSchema = Joi.object().keys({
  avatar: Joi.string().pattern(/^https?:\/\/\w+(\.\w+)*(:\d+)?(\/.*)?$/).required(),
});

router.get("/", getAllUsers);

router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: userIdSchema,
  }),
}), getUserById);

router.get("/me", getUserMe);

router.patch("/me", celebrate({
  body: userUpdateSchema,
}), updateProfile);

router.patch("/me/avatar", celebrate({
  body: avatarUpdateSchema,
}), updateAvatar);

module.exports = router;
