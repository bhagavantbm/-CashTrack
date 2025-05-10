const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Transaction = require('../models/Transaction'); // Required to delete related transactions
const authMiddleware = require('../middleware/authMiddleware');

// Add customer (secured route)
router.post('/', authMiddleware, async (req, res) => {
  const { name, phone, email } = req.body;
  const userId = req.user.id; // Get user ID from decoded token

  const newCustomer = new Customer({
    name,
    phone,
    email,
    userId,
  });

  try {
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get only customers created by the logged-in user
// GET /api/customers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id }).populate('transactions');
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('transactions');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    // Optional: delete all transactions related to this customer
    await Transaction.deleteMany({ customerId: req.params.id });

    res.json({ message: 'Customer and related transactions deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error while deleting customer' });
  }
});

module.exports = router;
