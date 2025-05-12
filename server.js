const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const app = express();
const port = 4000;


// Load env vars
require('dotenv').config();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://cash-track-nhlp.vercel.app']
}));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', require('./routes/transactions'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
