const { Router } = require("express");
const {
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.get("/", authMiddleware, getUsers);

router.put(
  "/:id",
  [authMiddleware, check("message", "Сообщение поста обязательно").notEmpty()],
  updateUser
);

router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
