const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // localhost
  user: process.env.DB_USER, // root
  // password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // testDB
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ' + err.stack);
    return;
  }
  console.log('Успешное подключение к базе данных');
});

module.exports = connection;