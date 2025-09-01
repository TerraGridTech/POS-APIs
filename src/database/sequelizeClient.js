
// Connection to Azure Database for MySQL
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
      //ssl: false
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    },
    logging: false
  }
);

module.exports = { sequelize };
