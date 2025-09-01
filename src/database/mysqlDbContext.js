const pool = require('./mysqlClient');
const { v4: uuidv4 } = require('uuid');

// Upsert client (based on phone number). Save clients
const crypto = require('crypto');

async function upsertCustomer(customer) {
  const { name, phone, email } = customer;

  // Verifica se o cliente já existe pelo telefone
  const [rows] = await pool.query(
    'SELECT id FROM customers WHERE phone = ?',
    [phone]
  );

  if (rows.length > 0) {
    return rows[0].id;
  }

  // Gera um UUID com 12 caracteres (base36 ou hex recortado)
  const id = uuidv4();

  // Faz o insert com o ID explícito
  const [result] = await pool.query(
    'INSERT INTO customers (id, name, phone, email) VALUES (?, ?, ?, ?)',
    [id, name, phone, email || null]
  );

  return id;
}

// Insert/save transaction
async function insertTransaction(transaction) {

  const {
    transaction_number,
    store_id,
    customer_id,
    date,
    payment_method,
    total_amount,
    receipt_url,
    qr_code_url
  } = transaction;

  const id = uuidv4();

   const [result] = await pool.query(
    `INSERT INTO transactions 
    (id, transaction_number, store_id, customer_id, date, payment_method, total_amount, receipt_url, qr_code_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      transaction_number,
      store_id,
      customer_id,
      new Date(date),
      payment_method,
      total_amount,
      receipt_url,
      qr_code_url
    ]
  );

  return id;
}

// Insert/save transaction item
async function insertTransactionItem(transactionId, item) {
  
  const id = uuidv4();

  const {name, item_id, quantity, price, discount = 0, tax = 0 } = item;
  await pool.query(
    `INSERT INTO transaction_items 
    (id, transaction_id, item_id, item_name, quantity, price, discount, tax)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      transactionId,
      item_id,
      name, // item_name
      quantity,
      price,
      discount,
      tax
    ]
  );
}

async function testConnection() {
  const [rows] = await pool.query('SELECT NOW() AS now');
  return rows[0];
}

async function getTransactionById(id) {
  const query = 'SELECT receipt_url, qr_code_url FROM transactions WHERE transaction_number = ?';
  
  try {
    const [results] = await pool.query(query, [id]);

    if (results.length === 0) {
      throw new Error('Transação não encontrada');
    }

    return results[0]; // Returns the first result
  } catch (error) {
    throw error;
  }
}


module.exports = {
  upsertCustomer,
  insertTransaction,
  insertTransactionItem,
  testConnection,
  getTransactionById
};
