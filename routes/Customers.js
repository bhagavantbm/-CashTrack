const express = require('express');
const { addCustomer } = require('../Controllers/Customer');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addCustomer); // ✅ protect route

module.exports = router;
