const express = require("express");
const router = express.Router();
const {
  getBalance,
  depositRequest,
  getTransactions,
  getTransaction,
} = require("../controllers/walletController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/balance", protect, getBalance);
router.post("/deposit", protect, upload.single("screenshot"), depositRequest);
router.get("/transactions", protect, getTransactions);
router.get("/transactions/:id", protect, getTransaction);

module.exports = router;
