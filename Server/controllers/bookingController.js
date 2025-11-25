const Booking = require("../models/bookingModel");
const Service = require("../models/serviceModel");

const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, address } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(500).json({ message: "service is not found" });
    }

    const booking = await Booking.create({
      user: req.parmas._id,
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
      .populate("service", "name service")
      .populate("user", "name user")
      .populate("provider", "name provider");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings };
