require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const http = require('http');             // <-- import http module
const { Server } = require('socket.io');  // <-- import socket.io Server

const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/Customers');
const transactionRoutes = require('./routes/Transaction');
const authRoutes = require('./routes/auth');

const app = express();

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO server with CORS config matching frontend
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://cash-track-nhlp.vercel.app'],
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://cash-track-nhlp.vercel.app'],
}));
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to CashTrack API!');
});

// Make io accessible in routes through request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 4000;
    // Use the HTTP server to listen, not app.listen
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Optional: Handle socket connections
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});
