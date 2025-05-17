// models/customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // This connects to User model
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
