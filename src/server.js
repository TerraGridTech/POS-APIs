// src/server.js
const app = require('./app');

 const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`POS Data Ingestion Service running on port ${PORT}`);
});
