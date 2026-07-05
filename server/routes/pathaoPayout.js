const express = require('express');
const router = express.Router();
const PathaoPayout = require('../models/PathaoPayout');

router.get('/', async (req, res) => {
  try {
    const payouts = await PathaoPayout.find().sort({ payoutDate: -1 });
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payout = new PathaoPayout(req.body);
    const saved = await payout.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await PathaoPayout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
