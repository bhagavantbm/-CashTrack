const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// WebSocket io
const io = require('socket.io-client'); // Import socket.io client here if needed in certain routes

// Add customer (secured route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const customer = new Customer({
      name,
      phone,
      userId: req.user.id // From token
    });

    await customer.save();

    // Emit event to all connected clients when a new customer is added
    io.emit('new-customer', customer);

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error adding customer:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get only customers created by the logged-in user (secured route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Fetch customers for the logged-in user
    const customers = await Customer.find({ userId: req.user.id }).populate('transactions');
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific customer by ID (secured route)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Fetch the specific customer only if it belongs to the logged-in user
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.id }).populate('transactions');
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete customer by ID (secured route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Find and delete the customer only if it belongs to the logged-in user
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    // Delete all transactions related to this customer
    await Transaction.deleteMany({ customerId: req.params.id });

    // Emit event when a customer is deleted
    io.emit('customer-deleted', customer);

    res.json({ message: 'Customer and related transactions deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error while deleting customer' });
  }
});

module.exports = router;
