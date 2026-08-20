const mongoose = require(`mongoose`);

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, enum: [`income`, `expense`], required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Category`,
      required: true,
    },
    description: { type: String },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: `User`, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model(`Transaction`, transactionSchema);
