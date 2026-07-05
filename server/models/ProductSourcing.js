const mongoose = require('mongoose');

const productSourcingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  productName: { type: String, required: true },
  batchNumber: { type: String, required: true },
  unitCost: { type: Number, required: true },
  packagingCost: { type: Number, required: true },
  totalBDT: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ProductSourcing', productSourcingSchema);
