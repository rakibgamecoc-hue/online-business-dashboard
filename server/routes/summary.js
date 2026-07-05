const express = require('express');
const router = express.Router();
const AdsExpense = require('../models/AdsExpense');
const DollarWallet = require('../models/DollarWallet');
const ProductSourcing = require('../models/ProductSourcing');
const OperatingCost = require('../models/OperatingCost');
const PathaoPayout = require('../models/PathaoPayout');

router.get('/', async (req, res) => {
  try {
    const [adsResult] = await AdsExpense.aggregate([
      { $group: { _id: null, total: { $sum: '$amountBDT' } } },
    ]);
    const [dollarResult] = await DollarWallet.aggregate([
      { $group: { _id: null, totalBDT: { $sum: '$bdtSpent' }, totalUSD: { $sum: '$usdReceived' } } },
    ]);
    const [sourcingResult] = await ProductSourcing.aggregate([
      { $group: { _id: null, total: { $sum: '$totalBDT' } } },
    ]);
    const [opsResult] = await OperatingCost.aggregate([
      { $group: { _id: null, total: { $sum: '$amountBDT' } } },
    ]);
    const [revenueResult] = await PathaoPayout.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amountBDT' } } },
    ]);
    const [pendingResult] = await PathaoPayout.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amountBDT' } } },
    ]);

    const totalAds = adsResult?.total || 0;
    const totalDollarBDT = dollarResult?.totalBDT || 0;
    const totalDollarUSD = dollarResult?.totalUSD || 0;
    const totalSourcing = sourcingResult?.total || 0;
    const totalOps = opsResult?.total || 0;
    const totalRevenue = revenueResult?.total || 0;
    const totalPending = pendingResult?.total || 0;
    const totalExpenses = totalAds + totalSourcing + totalOps;
    const netProfit = totalRevenue - totalExpenses;

    res.json({
      totalAds,
      totalDollarBDT,
      totalDollarUSD,
      totalSourcing,
      totalOps,
      totalRevenue,
      totalPending,
      totalExpenses,
      netProfit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
