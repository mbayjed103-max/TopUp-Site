const User = require("../models/User");
const Transaction = require("../models/Transaction");
const TopUp = require("../models/TopUp");

// @desc    Get all pending deposits
// @route   GET /api/admin/deposits/pending
// @access  Private/Admin
exports.getPendingDeposits = async (req, res) => {
  try {
    const deposits = await Transaction.find({
      type: "deposit",
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("user", "username email phoneNumber");

    res.json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve/Reject deposit
// @route   PUT /api/admin/deposits/:id
// @access  Private/Admin
exports.processDeposit = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Transaction already processed",
      });
    }

    transaction.status = status;
    transaction.adminNote = adminNote;
    transaction.processedBy = req.user.id;
    transaction.processedAt = Date.now();
    await transaction.save();

    // If approved, add to user wallet
    if (status === "approved") {
      const user = await User.findById(transaction.user);
      user.wallet.balance += transaction.amount;
      user.wallet.transactions.push(transaction._id);
      await user.save();
    }

    res.json({
      success: true,
      message: `Deposit ${status} successfully`,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
exports.getAllTransactions = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("user", "username email phoneNumber")
      .populate("processedBy", "username");

    const count = await Transaction.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all top-ups
// @route   GET /api/admin/topups
// @access  Private/Admin
exports.getAllTopUps = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;

    const topUps = await TopUp.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("user", "username email phoneNumber")
      .populate("transaction");

    const count = await TopUp.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      topUps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const pendingDeposits = await Transaction.countDocuments({
      type: "deposit",
      status: "pending",
    });
    const completedTopUps = await TopUp.countDocuments({ status: "completed" });

    const totalRevenue = await Transaction.aggregate([
      { $match: { type: "deposit", status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const todayRevenue = await Transaction.aggregate([
      {
        $match: {
          type: "deposit",
          status: "approved",
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingDeposits,
        completedTopUps,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
