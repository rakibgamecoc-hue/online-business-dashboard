const express = require('express');
const router = express.Router();
const AdsExpense = require('../models/AdsExpense');

// GET all ads expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await AdsExpense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new ads expense
router.post('/', async (req, res) => {
  try {
    const expense = new AdsExpense(req.body);
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE ads expense
router.delete('/:id', async (req, res) => {
  try {
    await AdsExpense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
