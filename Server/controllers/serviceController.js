const Service = require("../models/serviceModel");
const Category = require("../models/categoryModel");

//creating new service
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(500).json({ message: "Invalid category Id" });
    }

    const service = await Service.create({
      user: req.user._id,
      provider: req.user._id,
      category,
      name,
      description,
      price,
      duration,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getting all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({})
      .populate("category", "name slug")
      .populate("provider", "name email");

    res.json({ count: services.length, services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get specific single service
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id)
      .populate("category", "name")
      .populate("provider", "name email");

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }
    res.json(service);
  } catch (error) {
    res.status(500).status({
      message: error.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
};
