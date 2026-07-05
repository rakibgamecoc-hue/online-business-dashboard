const mongoose = require('mongoose');

const operatingCostSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, enum: ['Poly Bags', 'Cartoons', 'Mobile Recharge', 'Other'], required: true },
  description: { type: String, default: '' },
  amountBDT: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('OperatingCost', operatingCostSchema);
