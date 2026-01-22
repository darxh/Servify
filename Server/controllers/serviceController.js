const Service = require("../models/serviceModel");
const Category = require("../models/categoryModel");

// @desc    Create new service
// @route   POST /api/v1/services
// @access  Private (Provider)
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => file.path);
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category Id" });
    }

    const service = await Service.create({
      user: req.user._id,
      provider: req.user._id,
      category,
      name,
      description,
      price,
      duration,
      images: imagePaths.length > 0 ? imagePaths : undefined, 
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services (with Search & Filter)
// @route   GET /api/v1/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

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

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    }

    const services = await Service.find(filters)
      .populate("category", "name slug")
      .populate("provider", "name email")
      .sort(sortOption);

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
      .populate("provider", "name email")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name" }
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
    const { name, description, price, duration, category } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: "Not authorized" });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;
    service.duration = duration || service.duration;
    service.category = category || service.category;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      service.images = newImages;
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