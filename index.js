// ==== server/index.js ====
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/Customers');
const transactionRoutes = require('./routes/Transaction');
const cloudinary = require('cloudinary').v2; // Cloudinary SDK



const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/transactions', transactionRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/minikhata', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);

app.listen(4000, () => console.log('Server running on http://localhost:4000'));