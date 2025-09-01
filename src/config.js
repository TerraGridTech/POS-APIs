require('dotenv').config(); // Carrega as variáveis do .env

module.exports = {
  secretKey: process.env.JWT_SECRET,  // Usando a chave JWT do .env
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,  // Usando a chave do refresh token
};
