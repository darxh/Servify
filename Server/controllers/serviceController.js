const Service = require("../models/serviceModel");
const Category = require("../models/categoryModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");

// @desc    Create new service
// @route   POST /api/v1/services
// @access  Private (Provider)
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category, address, lat, lng, phoneNumber } = req.body;

    if (phoneNumber) {
      const user = await User.findById(req.user._id);
      if (user && !user.phoneNumber) {
        user.phoneNumber = phoneNumber;
        await user.save();
      }
    }
    
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => file.path);
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category Id" });
    }

    let locationObject = undefined;
    if (lat && lng) {
      locationObject = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)],
      };
    }

    const service = await Service.create({
      user: req.user._id,
      provider: req.user._id,
      category,
      name,
      description,
      price,
      duration,
      images: imagePaths,
      address,
      location: locationObject
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services (with Search & Filter & Location)
// @route   GET /api/v1/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, lat, lng, radius } = req.query;

    const keywordFilter = keyword
      ? {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }
      : {};

    const filters = { ...keywordFilter };

    if (category) {
      filters.category = category;
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (lat && lng) {
      const radiusInMeters = radius ? Number(radius) * 1000 : 50000;
      filters.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: radiusInMeters,
        },
      };
    }

    let sortOption = {};
    if (!lat || !lng) {
      sortOption = { createdAt: -1 };
      if (sort === "price-asc") {
        sortOption = { price: 1 };
      } else if (sort === "price-desc") {
        sortOption = { price: -1 };
      }
    }

    // Execute query
    let query = Service.find(filters)
      .populate("category", "name slug")
      .populate("provider", "name email profileImage")
      .populate("reviews");

    if (Object.keys(sortOption).length > 0) {
      query = query.sort(sortOption);
    }

    const services = await query.exec();

    res.json({ count: services.length, services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/v1/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category", "name")
      .populate("provider", "name email profileImage bio")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name profileImage" }
      });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/v1/services/:id
// @access  Private (Provider)
const updateService = async (req, res) => {
  try {
    const { name, description, price, duration, category, address, lat, lng } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ message: "Service not found" });

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: "Not authorized" });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;
    service.duration = duration || service.duration;
    service.category = category || service.category;
    service.address = address || service.address;
    if (lat && lng) {
      service.location = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)]
      };
    }

    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((file) => file.path);
      service.images = [...(service.images || []), ...newImagePaths];
    }

    const updatedService = await service.save();
    res.json(updatedService);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/v1/services/:id
// @access  Private (Provider)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const activeBookings = await Booking.countDocuments({
      service: service._id,
      status: { $in: ["pending", "confirmed"] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: `Cannot delete service. There are ${activeBookings} active bookings for this service. Please cancel them first.`
      });
    }

    await service.deleteOne();
    res.json({ message: "Service removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};