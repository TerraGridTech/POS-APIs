const { normalize } = require('zod/v4');
const { transactionSchema } = require('../models/transaction.model');

function normalizeTransaction(data) {
    
const { platform } = data;

console.log('plataforma', platform);

  switch (platform.toLowerCase()) {
    case 'pos':
      return normalizeFromPOS(data);
    case 'quickbooks':
      return normalizeFromQuickBooks(data);
    case 'zoho':
      return normalizeFromZoho(data);
    case 'tally':
      return normalizeFromTally(data);
    default:
      throw new Error(`Plataforma não suportada: ${platform}`);
  }
}

function normalizeFromPOS(data) {
 
    const normalized = {
    transaction_number: data.transaction_id,
    store_id: data.store_id,   // 'DEFAULT_STORE',
    pos_terminal_id: data.pos_terminal_id, // 'POS_01',
    date: data.date || new Date().toISOString(),
    timestamp: new Date().toISOString(),
    payment_method: data.payment_method, //'credit_card',
    total_amount: data.total_amount,
    items: data.items.map(item => ({
      item_id: item.item_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      tax: item.tax || 0
    })),
    customer: {
      name: data.customer?.name ?? '',
      phone: data.customer?.phone ?? '',
      email: data.customer?.email ?? ''
    }
  };
    
  const result = transactionSchema.safeParse(normalized);
  if (!result.success) return { error: result.error };
  return { data: result.data };

}

function normalizeFromQuickBooks(data) {
 const normalized = {
    transaction_number: data.transaction_id,
    store_id: data.store_id,   // 'DEFAULT_STORE',
    pos_terminal_id: data.pos_terminal_id, // 'POS_01',
    date: data.date || new Date().toISOString(),
    timestamp: new Date().toISOString(),
    payment_method: data.payment_method, //'credit_card',
    total_amount: data.total_amount,
    items: data.items.map(item => ({
      item_id: item.item_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      tax: item.tax || 0
    })),
    customer: {
      name: data.customer?.name ?? '',
      phone: data.customer?.phone ?? '',
      email: data.customer?.email ?? ''
    }
  };
    
  const result = transactionSchema.safeParse(normalized);
  if (!result.success) return { error: result.error };
  return { data: result.data };
}

function normalizeFromZoho(data) {
 const normalized = {
    transaction_number: data.transaction_id,
    store_id: data.store_id,   // 'DEFAULT_STORE',
    pos_terminal_id: data.pos_terminal_id, // 'POS_01',
    date: data.date || new Date().toISOString(),
    timestamp: new Date().toISOString(),
    payment_method: data.payment_method, //'credit_card',
    total_amount: data.total_amount,
    items: data.items.map(item => ({
      item_id: item.item_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      tax: item.tax || 0
    })),
    customer: {
      name: data.customer?.name ?? '',
      phone: data.customer?.phone ?? '',
      email: data.customer?.email ?? ''
    }
  };
    
  const result = transactionSchema.safeParse(normalized);
  if (!result.success) return { error: result.error };
  return { data: result.data };
}


function normalizeFromTally(data) {
  const normalized = {
    transaction_number: data.transaction_id,
    store_id: data.store_id,   // 'DEFAULT_STORE',
    pos_terminal_id: data.pos_terminal_id, // 'POS_01',
    date: data.date || new Date().toISOString(),
    timestamp: new Date().toISOString(),
    payment_method: data.payment_method, //'credit_card',
    total_amount: data.total_amount,
    items: data.items.map(item => ({
      item_id: item.item_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      tax: item.tax || 0
    })),
    customer: {
      name: data.customer?.name ?? '',
      phone: data.customer?.phone ?? '',
      email: data.customer?.email ?? ''
    }
  };
    
  const result = transactionSchema.safeParse(normalized);
  if (!result.success) return { error: result.error };
  return { data: result.data };
}

// Adicione as demais plataformas...
module.exports = { 
  normalizeTransaction, 
  normalizeFromPOS, 
  normalizeFromQuickBooks, 
  normalizeFromTally,
  normalizeFromZoho
 };
 