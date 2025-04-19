require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
const loanOfficerRoutes = require("./routes/loanOfficerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Microloan Management API is running...");
});

app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/balances", balanceRoutes);
app.use("/api/loan-applications", loanOfficerRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "❌ Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
