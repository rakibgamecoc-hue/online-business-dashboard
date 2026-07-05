const mongoose = require('mongoose');

const pathaoPayoutSchema = new mongoose.Schema({
  payoutDate: { type: Date, required: true },
  consignmentId: { type: String, required: true },
  amountBDT: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Pending'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('PathaoPayout', pathaoPayoutSchema);
