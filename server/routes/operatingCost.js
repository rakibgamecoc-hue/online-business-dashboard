const express = require('express');
const router = express.Router();
const OperatingCost = require('../models/OperatingCost');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const records = await OperatingCost.find({ user: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const record = new OperatingCost({ ...req.body, user: req.user.id });
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await OperatingCost.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
