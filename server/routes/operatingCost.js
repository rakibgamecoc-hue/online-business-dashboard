const express = require('express');
const router = express.Router();
const OperatingCost = require('../models/OperatingCost');

router.get('/', async (req, res) => {
  try {
    const costs = await OperatingCost.find().sort({ date: -1 });
    res.json(costs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const cost = new OperatingCost(req.body);
    const saved = await cost.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await OperatingCost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
