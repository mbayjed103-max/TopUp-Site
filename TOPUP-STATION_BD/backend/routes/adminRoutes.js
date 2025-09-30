const express = require("express");
const router = express.Router();
const {
  getPendingDeposits,
  processDeposit,
  getAllTransactions,
  getAllTopUps,
  getStats,
  getAllUsers,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);
router.use(adminOnly);

router.get("/deposits/pending", getPendingDeposits);
router.put("/deposits/:id", processDeposit);
router.get("/transactions", getAllTransactions);
router.get("/topups", getAllTopUps);
router.get("/stats", getStats);
router.get("/users", getAllUsers);

module.exports = router;
