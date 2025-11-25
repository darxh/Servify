const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
} = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");

router.use(protect);
route.post("/".createBooking);
router.get("/my-bookings", getMyBookings);

module.exports = router;
