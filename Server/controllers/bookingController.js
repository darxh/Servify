const Booking = require("../models/bookingModel");
const Service = require("../models/serviceModel");
const User = require("../models/userModel");

const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, address, phoneNumber } = req.body;

    const requestedDate = new Date(bookingDate);
    const now = new Date();

    if (requestedDate < now) {
      return res.status(400).json({ message: "Cannot book dates in the past." });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot book your own service" });
    }

    const newStart = requestedDate.getTime();
    const newEnd = newStart + (service.duration * 60000);

    const existingBookings = await Booking.find({
      provider: service.provider,
      status: { $in: ["pending", "confirmed"] },
    }).populate("service");

    const hasConflict = existingBookings.some((booking) => {
      const existingStart = new Date(booking.bookingDate).getTime();
      const existingDuration = booking.service ? booking.service.duration : 60;
      const existingEnd = existingStart + (existingDuration * 60000);

      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasConflict) {
      return res.status(400).json({
        message: "This time slot is already booked. Please choose another time."
      });
    }

    if (phoneNumber) {
      const user = await User.findById(req.user._id);
      if (user && !user.phoneNumber) {
        user.phoneNumber = phoneNumber;
        await user.save();
      }
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider: service.provider,
      service: service._id,
      amount: service.price,
      bookingDate,
      address,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ user: req.user._id }, { provider: req.user._id }],
    })
      .populate("service", "name price image images duration category")
      .populate("user", "name email phoneNumber")
      .populate("provider", "name email phoneNumber")
      .sort("-createdAt");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.provider.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this booking",
      });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to cancel this booking"
      });
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.status(400).json({
        message: `Cannot cancel booking that is already ${booking.status}`
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = { createBooking, getMyBookings, UpdateBookingStatus, cancelBooking };