const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Customer = require('../models/customer');
const authMiddleware = require('../middleware/authMiddleware');

// Add a transaction for a specific customer (secured)
router.post('/:customerId', authMiddleware, async (req, res) => {
  const { customerId } = req.params;
  const { type, amount, description } = req.body;
  const userId = req.user.id;

  try {
    const customer = await Customer.findOne({ _id: customerId, userId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    if (!type || !amount) {
      return res.status(400).json({ message: 'Missing required fields: type or amount' });
    }

    const transaction = new Transaction({
      type,
      amount,
      description,
      customer: customerId,
    });

    await transaction.save();

    customer.transactions.push(transaction._id);
    await customer.save();

    const updatedCustomer = await Customer.findById(customerId).populate('transactions');
    res.status(201).json({ transaction, customer: updatedCustomer });

  } catch (err) {
    console.error('Error adding transaction:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a transaction (secured)
router.delete('/:customerId/:transactionId', authMiddleware, async (req, res) => {
  const { customerId, transactionId } = req.params;
  const userId = req.user.id;

  try {
    const customer = await Customer.findOne({ _id: customerId, userId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    await Transaction.findByIdAndDelete(transactionId);

    await Customer.findByIdAndUpdate(customerId, {
      $pull: { transactions: transactionId }
    });

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

module.exports = router;
