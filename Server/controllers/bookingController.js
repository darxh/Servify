// Server/controllers/bookingController.js
const Booking = require("../models/bookingModel");
const Service = require("../models/serviceModel");

const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, address } = req.body;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Prevent Provider from booking their own service
    if (service.provider.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot book your own service" });
    }

    // avalibilty checking
    const newStartTime = new Date(bookingDate);
    const newEndTime = new Date(newStartTime.getTime() + service.duration * 60000); \

    const existingBookings = await Booking.find({
      provider: service.provider,
      status: { $in: ["pending", "confirmed"] },
    }).populate("service");

    const hasConflict = existingBookings.some((booking) => {
      const existingStart = new Date(booking.bookingDate);
      const duration = booking.service ? booking.service.duration : 60;
      const existingEnd = new Date(existingStart.getTime() + duration * 60000);

      return newStartTime < existingEnd && newEndTime > existingStart;
    });

    if (hasConflict) {
      return res.status(400).json({
        message: "Provider is already booked for this time slot. Please choose another time."
      });
    }

    // Create Booking
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
      .populate("service", "name price")
      .populate("user", "name email")
      .populate("provider", "name");

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
      booking.user.toString() !== req.user._id.toString() &&
      booking.provider.toString() !== req.user._id.toString()
    ) {
      res.status(403).json({
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

module.exports = { createBooking, getMyBookings, UpdateBookingStatus };