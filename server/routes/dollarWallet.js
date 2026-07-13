const express = require('express');
const router = express.Router();
const DollarWallet = require('../models/DollarWallet');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const records = await DollarWallet.find({ user: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    // #region agent log
    const fs = require('fs');
    const logPath = require('path').resolve(__dirname, '../../debug-d155c8.log');
    fs.appendFileSync(logPath, JSON.stringify({sessionId:'d155c8',location:'dollarWallet.js:POST',message:'Create request received',data:{body:req.body,hasUser:!!req.user?.id},timestamp:Date.now(),hypothesisId:'A,B'}) + '\n');
    // #endregion
    const record = new DollarWallet({ ...req.body, user: req.user.id });
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err) {
    // #region agent log
    const fs = require('fs');
    const logPath = require('path').resolve(__dirname, '../../debug-d155c8.log');
    fs.appendFileSync(logPath, JSON.stringify({sessionId:'d155c8',location:'dollarWallet.js:POST:error',message:'Create request failed',data:{body:req.body,error:err.message},timestamp:Date.now(),hypothesisId:'A'}) + '\n');
    // #endregion
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await DollarWallet.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
