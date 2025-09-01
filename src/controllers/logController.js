const { logSchema} = require('../models/logSchema');
const pool = require('../database/mysqlClient');
const client = require('../services/insights'); // App Insights

async function logRegister(req, res) {
  const logData = req.body;

  // ✅ Validação
  const result = logSchema.safeParse(logData);

  if (!result.success) {
    return res.status(400).json({
      error: 'Dados inválidos para log',
      details: result.error.errors,
    });
  }

  const validData = result.data;

  const formattedTimestamp = new Date(validData.timestamp).toISOString().slice(0, 19).replace('T', ' ');

  try {
    // ✅ Salvar no banco relacional
    const insertQuery = `
      INSERT INTO logs (event_type, timestamp, pos_id, transaction_id, receipt_url, qr_code_url, duration_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [
      validData.eventType,
      formattedTimestamp,
      validData.posId,
      validData.transactionId,
      validData.receipt_url,
      validData.qr_code_url,
      validData.durationMs,
    ]);

    // ✅ Log no Application Insights
    client.trackEvent({ name: "CustomLogEvent", properties: validData });
   // res.status(201).json({ message: 'Log armazenado com sucesso' });
  } catch (error) {
    client.trackException({ exception: error });
   // res.status(500).json({ error: 'Erro ao salvar log' });
  }
}

module.exports = { logRegister };
