// models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'], // ✅ Fix
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '', // Ensure description is never null
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true, // Ensure transaction is always associated with a customer
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
