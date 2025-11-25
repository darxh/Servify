const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  UpdateBookingStatus,
} = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");

router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.put("/:id", UpdateBookingStatus);

module.exports = router;
