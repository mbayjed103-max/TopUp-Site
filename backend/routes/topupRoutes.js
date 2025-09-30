const express = require("express");
const router = express.Router();
const {
  getPackages,
  createOrder,
  getHistory,
  getOrder,
} = require("../controllers/topupController");
const { protect } = require("../middleware/auth");

router.get("/packages", getPackages);
router.post("/order", protect, createOrder);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getOrder);

module.exports = router;
