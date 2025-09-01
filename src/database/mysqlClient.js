
// Connection to Azure Database for MySQL
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10
});

module.exports = pool;
