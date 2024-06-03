const db = require('../db')

class UserController {
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const sortBy = 'registration_date';
      const sortOrder = 'ASC';
      const offset = (page - 1) * limit;
      const query = `SELECT * FROM users ORDER BY ${sortBy} ${sortOrder} LIMIT ${limit} OFFSET ${offset}`;

      db.query(query, (error, results) => {
        if (error) {
          return res.status(400).json({ message: 'Ошибка получения списка пользователей' })
        }
        res.json(results)
      })
    } catch (err) {
      console.log(err)
      res.status(400).json({ message: 'Ошибка получения списка пользователей' })
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params

      let params = []
      let fields = []

      for (const key of ['first_name', 'last_name', 'email', 'gender']) {
        if (req.body[key]) {
          fields.push(`${key} = ?`);
          params.push(req.body[key]);
        }
      }

      
      if (req.body.photo) {
        fields.push(`photo = ?`);
        params.push(Buffer.from(req.body.photo, 'base64'));
      }

      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ${id}`

      db.query(query, params, (error, results) => {
        if (error) {
          console.log(error)
          return res.status(400).json({ message: 'Ошибка изменения пользователя' })
        }

        if (results.affectedRows > 0) {
          res.json({ message: 'Пользователь успешно изменен' })
        } else {
          res.status(400).json({ message: 'Пользователь не найден' })
        }
      })
    } catch (err) {
      console.log(err)
      res.status(400).json({ message: 'Ошибка изменения пользователя' })
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params

      const query = 'DELETE FROM users WHERE id = ?'
      db.query(query, [id], (error, results) => {
        if (error) {
          console.log(error)
          return res.status(400).json({ message: 'Ошибка удаления пользователя' })
        }

        if (results.affectedRows > 0) {
          res.json({ message: 'Пользователь успешно удален' })
        } else {
          res.status(400).json({ message: 'Пользователь не найден' })
        }
      })
    } catch (err) {
      console.log(err)
      res.status(400).json({ message: 'Ошибка удаления пользователя' })
    }
  }
}

module.exports = new UserController()
