const User = require("../models/User");
const Transaction = require("../models/Transaction");

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      balance: user.wallet.balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Deposit request
// @route   POST /api/wallet/deposit
// @access  Private
exports.depositRequest = async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    const screenshot = req.file ? req.file.filename : null;

    if (!screenshot) {
      return res.status(400).json({
        success: false,
        message: "Please upload payment screenshot",
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: "deposit",
      paymentMethod,
      amount,
      transactionId,
      screenshot,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message:
        "Deposit request submitted successfully. Please wait for admin approval.",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("processedBy", "username");

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/wallet/transactions/:id
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("processedBy", "username");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
