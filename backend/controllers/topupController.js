const TopUp = require("../models/TopUp");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Diamond packages
const packages = [
  { diamonds: 100, price: 120, bonus: 0 },
  { diamonds: 310, price: 360, bonus: 10 },
  { diamonds: 520, price: 600, bonus: 20 },
  { diamonds: 1060, price: 1200, bonus: 60 },
  { diamonds: 2180, price: 2400, bonus: 180 },
  { diamonds: 5600, price: 6000, bonus: 600 },
];

// @desc    Get available packages
// @route   GET /api/topup/packages
// @access  Public
exports.getPackages = async (req, res) => {
  try {
    res.json({
      success: true,
      packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create top-up order
// @route   POST /api/topup/order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { freeFireUID, packageIndex, paymentMethod } = req.body;

    // Validate package
    if (packageIndex < 0 || packageIndex >= packages.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid package selected",
      });
    }

    const selectedPackage = packages[packageIndex];
    const user = await User.findById(req.user.id);

    // Check wallet balance if payment method is wallet
    if (paymentMethod === "wallet") {
      if (user.wallet.balance < selectedPackage.price) {
        return res.status(400).json({
          success: false,
          message: "Insufficient wallet balance",
        });
      }

      // Deduct from wallet
      user.wallet.balance -= selectedPackage.price;
      await user.save();

      // Create wallet transaction
      const transaction = await Transaction.create({
        user: req.user.id,
        type: "topup",
        paymentMethod: "wallet",
        amount: selectedPackage.price,
        status: "completed",
      });

      // Create top-up order
      const topUp = await TopUp.create({
        user: req.user.id,
        freeFireUID,
        package: selectedPackage,
        paymentMethod,
        status: "processing",
        transaction: transaction._id,
      });

      // Simulate top-up processing (in real scenario, call Free Fire API)
      setTimeout(async () => {
        topUp.status = "completed";
        topUp.completedAt = Date.now();
        await topUp.save();
      }, 5000);

      return res.status(201).json({
        success: true,
        message: "Top-up order created successfully",
        topUp,
      });
    }

    // For other payment methods, create pending order
    const topUp = await TopUp.create({
      user: req.user.id,
      freeFireUID,
      package: selectedPackage,
      paymentMethod,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Please complete the payment",
      topUp,
      paymentInstructions: {
        amount: selectedPackage.price,
        method: paymentMethod,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's top-up history
// @route   GET /api/topup/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const topUps = await TopUp.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("transaction");

    res.json({
      success: true,
      count: topUps.length,
      topUps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single top-up order
// @route   GET /api/topup/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const topUp = await TopUp.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("transaction");

    if (!topUp) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      topUp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
