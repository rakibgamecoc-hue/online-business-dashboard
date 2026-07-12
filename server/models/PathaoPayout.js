const mongoose = require('mongoose');

const pathaoPayoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  amountBDT: { type: Number, required: true },
  consignmentId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('PathaoPayout', pathaoPayoutSchema);
