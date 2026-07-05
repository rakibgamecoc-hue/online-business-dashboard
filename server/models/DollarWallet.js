const mongoose = require('mongoose');

const dollarWalletSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  bdtSpent: { type: Number, required: true },
  usdReceived: { type: Number, required: true },
  rate: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DollarWallet', dollarWalletSchema);
