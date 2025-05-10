const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Customer = require('../models/customer');

// Add a transaction for a specific customer
// Add a transaction for a specific customer
router.post('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { type, amount, description } = req.body;

  try {
    // Check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate required fields for the transaction
    if (!type || !amount) {
      return res.status(400).json({ message: 'Missing required fields: type or amount' });
    }

    // Create the new transaction
    const transaction = new Transaction({
      type,
      amount,
      description,
      customer: customerId,
    });

    // Save the transaction
    await transaction.save();

    // Update the customer's transaction list
    customer.transactions.push(transaction._id);
    await customer.save();

    // Populate the customer with the new transaction list and send response
    const updatedCustomer = await Customer.findById(customerId).populate('transactions');
    res.status(201).json({ transaction, customer: updatedCustomer });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Delete a transaction
// DELETE a transaction and remove it from customer's transaction list
router.delete('/:customerId/:transactionId', async (req, res) => {
  const { customerId, transactionId } = req.params;

  try {
    // Delete the transaction document
    await Transaction.findByIdAndDelete(transactionId);

    // Remove transaction reference from customer's transactions array
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
