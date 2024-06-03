const { Router } = require("express");
const { login, registration } = require("../controllers/AuthController");
const { check } = require("express-validator");

const router = Router();

router.post(
  "/register",
  [
    check("first_name", "Имя пользователя обязательно").notEmpty(),
    check("email", "Email пользователя обязателен").notEmpty(),
    check("password", "Длина пароля должна быть не меньше 4 символов").isLength(
      {
        min: 4,
        // max: 20,
      }
    ),
  ],
  registration
);

router.post("/login", login);

module.exports = router;
