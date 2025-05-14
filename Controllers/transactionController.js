const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');

const createTransaction = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { type, amount, description } = req.body; 
    const userId = req.user.id;

    console.log('Received Transaction Data:', { type, amount, description });

    // Validate required fields
    if (!type || !amount) {
      return res.status(400).json({
        message: 'Missing required fields: type or amount',
      });
    }

    // Validate if amount is a valid number
    if (isNaN(parseFloat(amount))) {
      return res.status(400).json({
        message: 'Invalid amount value',
      });
    }

    // Check if the customer exists and belongs to the current user
    const customer = await Customer.findOne({ _id: customerId, userId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    // Create new transaction (no transactionMethod)
    const transaction = new Transaction({
      type,
      amount: parseFloat(amount),
      description: description || '',
      customer: customerId,
    });

    await transaction.save();

    // Link transaction to customer
    customer.transactions.push(transaction);
    await customer.save();

    console.log('Transaction created and linked to customer:', transaction);

    // Optionally, return updated customer with transaction for confirmation
    return res.status(201).json({ transaction, customer });

  } catch (error) {
    console.error('Error while creating transaction:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTransaction };
