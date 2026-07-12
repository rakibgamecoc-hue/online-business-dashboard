const express = require('express');
const router = express.Router();
const AdsExpense = require('../models/AdsExpense');
const DollarWallet = require('../models/DollarWallet');
const OperatingCost = require('../models/OperatingCost');
const PathaoPayout = require('../models/PathaoPayout');
const ProductSourcing = require('../models/ProductSourcing');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [ads, wallet, operating, payouts, products] = await Promise.all([
      AdsExpense.find({ user: userId }),
      DollarWallet.find({ user: userId }),
      OperatingCost.find({ user: userId }),
      PathaoPayout.find({ user: userId }),
      ProductSourcing.find({ user: userId })
    ]);

    const totalAdsExpense = ads.reduce((sum, item) => sum + item.amountBDT, 0);
    const totalWalletDeposit = wallet.reduce((sum, item) => sum + item.totalBDT, 0);
    const totalOperatingCost = operating.reduce((sum, item) => sum + item.amountBDT, 0);
    const totalPayouts = payouts.reduce((sum, item) => sum + item.amountBDT, 0);
    const totalProductSourcing = products.reduce((sum, item) => sum + item.costBDT, 0);

    const totalExpenses = totalAdsExpense + totalOperatingCost + totalProductSourcing;
    const totalRevenue = totalPayouts;
    const netProfit = totalRevenue - totalExpenses;

    res.json({
      totalAdsExpense,
      totalWalletDeposit,
      totalOperatingCost,
      totalPayouts,
      totalProductSourcing,
      totalExpenses,
      totalRevenue,
      netProfit
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
