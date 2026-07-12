const mongoose = require('mongoose');

const productSourcingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  costBDT: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ProductSourcing', productSourcingSchema);
