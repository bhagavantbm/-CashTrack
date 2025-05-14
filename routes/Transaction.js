const express = require('express');
const router = express.Router();

const { createTransaction } = require('../Controllers/transactionController');
const authenticateUser = require('../middleware/authMiddleware');

// POST /api/transactions/:customerId — create a transaction for a customer
router.post('/:customerId', authenticateUser, createTransaction);

module.exports = router;
