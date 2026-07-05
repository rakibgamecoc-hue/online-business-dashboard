const mongoose = require('mongoose');

const adsExpenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  platform: { type: String, enum: ['Meta', 'Google'], required: true },
  amountBDT: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AdsExpense', adsExpenseSchema);
