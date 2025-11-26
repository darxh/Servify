const Review = require("../models/reviewModel");
const Service = require("../models/serviceModel");

const createReview = async (req, res) => {
  try {
    const { rating, comment, serviceId } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      service: serviceId,
    });

    if (alreadyReviewed) {
      return res
        .status(404)
        .json({ message: "You have already reviewed this service" });
    }

    const review = await Review.create({
      user: req.user._id,
      service: serviceId,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      service: req.params.serviceId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
  deleteReview,
};
