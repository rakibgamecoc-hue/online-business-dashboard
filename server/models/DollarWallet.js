const mongoose = require('mongoose');

const dollarWalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  amountUSD: { type: Number, required: true },
  rateBDT: { type: Number, required: true },
  totalBDT: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DollarWallet', dollarWalletSchema);
