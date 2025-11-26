const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
router.get("/:serviceId", getReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;
