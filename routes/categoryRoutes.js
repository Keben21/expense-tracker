const express = require(`express`);
const Category = require(`../models/Category`);
const protect = require(`../middleware/authMiddleware`);

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name,
      user: req.userId,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.userId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name },
      { new: true },
    );

    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
});

module.exports = router;
