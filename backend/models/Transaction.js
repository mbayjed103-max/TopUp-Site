const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["deposit", "topup", "refund"],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["bkash", "nagad", "wallet"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: function () {
      return this.paymentMethod !== "wallet";
    },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  screenshot: {
    type: String,
    required: function () {
      return this.type === "deposit" && this.paymentMethod !== "wallet";
    },
  },
  adminNote: {
    type: String,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  processedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
