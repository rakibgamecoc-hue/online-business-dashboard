const mongoose = require('mongoose');

const adsExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  platform: { type: String, enum: ['Meta', 'Google'], required: true },
  amountBDT: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AdsExpense', adsExpenseSchema);
