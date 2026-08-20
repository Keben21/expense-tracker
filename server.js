require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require(`./routes/authRoutes`);
const categories = require(`./routes/categoryRoutes`);
const transactionRoutes = require(`./routes/transactionRoutes`);

const app = express();

app.use(express.json());
app.use(cors());
app.use(`/api/auth`, authRoutes);
app.use(`/api/categories`, categories);
app.use(`/api/transactions`, transactionRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
