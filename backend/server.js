const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const fs = require("fs");

// Debug: Log environment variables
console.log("=== Environment Variables ===");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ Loaded" : "✗ Missing");
console.log("PORT:", process.env.PORT || "Using default 5000");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓ Loaded" : "✗ Missing");
console.log("===========================\n");

// Connect to database
connectDB();

const app = express();

// Ensure upload directories exist
const uploadDir = path.join(__dirname, "../uploads/transactions");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✓ Created uploads directory");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/topup", require("./routes/topupRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Serve frontend for all non-API routes
app.get(/^\/(?!api|uploads).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✓ Server running on port ${PORT}`);
  console.log(`✓ Frontend: http://localhost:${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
});
