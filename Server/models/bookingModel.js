const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking datails required"],
    },
    address: {
      type: String,
      required: [true, "Address datails required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelleds"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
