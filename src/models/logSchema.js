const { z } = require('zod');
const mysql = require('mysql2/promise');

const logSchema = z.object({
  eventType: z.string().min(1, "eventType é obrigatório"),
  timestamp: z.string().datetime("timestamp inválido (use ISO string)"),
  posId: z.string().min(1, "posId é obrigatório"),
  transactionId: z.string().min(1, "transactionId é obrigatório"),
  receipt_url: z.string().url("receiptUrl inválido"),
  qr_code_url: z.string().url("qrCodeUrl inválido"),
  durationMs: z.number().int().nonnegative("durationMs deve ser um número positivo"),
});


module.exports = { logSchema };
