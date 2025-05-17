const Customer = require('../models/customer');

const addCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const customer = new Customer({
      name,
      phone,
      userId: req.user.id, // ✅ add userId from token
    });

    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error("Error adding customer:", err);
    res.status(500).json({ message: "Failed to add customer", error: err.message });
  }
};

module.exports = { addCustomer };
