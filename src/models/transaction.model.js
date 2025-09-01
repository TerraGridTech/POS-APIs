
const { z } = require('zod');

// Individual purchased item
const itemSchema = z.object({
  name: z.string().min(1),
  item_id: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(), 
  tax: z.number().nonnegative().optional()       
});

// Complete transaction
const transactionSchema = z.object({
  store_id: z.string().min(1),
  pos_terminal_id: z.string().min(1),
  transaction_number: z.string().min(1),
  timestamp: z.string().or(z.date()).optional(), 
  date: z.string().or(z.date()).optional(),
  items: z.array(itemSchema).min(1),
  discounts: z.number().nonnegative().optional().default(0),
  taxes: z.number().nonnegative().optional().default(0),
  total_amount: z.number().nonnegative(),
  payment_method: z.enum([
    'cash', 'credit_card', 'debit_card', 'pix', 'voucher', 'UPI', 'other'
  ]),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email()
  }).optional()
});

module.exports = {
  transactionSchema
};
