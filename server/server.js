const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ads-expense', require('./routes/adsExpense'));
app.use('/api/dollar-wallet', require('./routes/dollarWallet'));
app.use('/api/product-sourcing', require('./routes/productSourcing'));
app.use('/api/operating-costs', require('./routes/operatingCost'));
app.use('/api/pathao-payout', require('./routes/pathaoPayout'));
app.use('/api/summary', require('./routes/summary'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.json({ message: 'BD Analytics Dashboard API' }));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
