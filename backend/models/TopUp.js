const mongoose = require("mongoose");

const topUpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  freeFireUID: {
    type: String,
    required: [true, "Please provide Free Fire UID"],
    validate: {
      validator: function (v) {
        return /^\d{8,12}$/.test(v);
      },
      message: "Please provide a valid Free Fire UID (8-12 digits)",
    },
  },
  package: {
    diamonds: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      default: 0,
    },
  },
  paymentMethod: {
    type: String,
    enum: ["wallet", "bkash", "nagad"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  completedAt: {
    type: Date,
  },
  failureReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TopUp", topUpSchema);
