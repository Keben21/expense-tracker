const express = require(`express`);
const mongoose = require(`mongoose`);
const Transaction = require(`../models/transactionModel`);
const protect = require(`../middleware/authMiddleware`);

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      description,
      date,
      user: req.userId,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { user: req.userId };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find(filter).populate("category");
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("category");
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { amount, type, category, description, date },
      { new: true },
    );

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.get("/summary/balance", protect, async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    result.forEach((item) => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    res.json({
      income,
      expense,
      balance: income - expense,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.get("/summary/by-category", protect, async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          _id: 0,
          category: "$categoryInfo.name",
          total: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

module.exports = router;
