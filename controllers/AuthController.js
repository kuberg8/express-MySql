const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");

const db = require("../db");

const generateAccessToken = (id) => {
  const payload = {
    id,
  };

  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка регистрации", errors: errors.array() });
      }

      const { email, password, first_name } = req.body;
      const query = 'SELECT * FROM users WHERE email = ?';
      
      db.query(query, [email], async (error, results) => {
        if (error) {
          return res.status(400).json({ message: "Ошибка при поиске пользователя" });
        }
        
        if (results.length > 0) {
          return res.status(400).json({ message: "Пользователь с такой почтой уже существует" });
        }
        
        const hashPassword = await bcrypt.hash(password, 7);
        const insertQuery = 'INSERT INTO users (email, password, first_name) VALUES (?, ?, ?)';
        
        db.query(insertQuery, [email, hashPassword, first_name], (error) => {
          if (error) {
            return res.status(400).json({ message: "Ошибка при создании пользователя" });
          }

          return res.json({ message: "Пользователь успешно создан" });
        });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Ошибка регистрации" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const query = 'SELECT * FROM users WHERE email = ?';
      
      db.query(query, [email], async (error, results) => {
        if (error || results.length === 0) {
          return res.status(400).json({ message: "Пользователь не найден" });
        }
        
        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
          return res.status(400).json({ message: "Неверный логин или пароль" });
        }

        const token = generateAccessToken(user.id);
        return res.json({ token, user_id: user.id });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Ошибка авторизации" });
    }
  }
}

module.exports = new AuthController();