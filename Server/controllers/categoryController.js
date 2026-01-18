const Category = require("../models/categoryModel");

//create new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({
        message: "category already exists",
      });
    }

    const category = await Category.create({ name });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//get all category
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    
    res.json({ message: "Category removed successfully" });
  } catch (error) {
    res.status(500).status({
      message: error.message,
    });
  }
};

//getall services
const getAllServices = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

    //Build the Search Query
    const keywordFilter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    //Build Category & Price Filters
    const filters = { ...keywordFilter };

    if (category) {
      filters.category = category;
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Handle Sorting
    let sortOption = { createdAt: -1 };  
    if (sort === "price-asc") {
      sortOption = { price: 1 };  
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };  
    }

    // Execute Query
    const services = await Service.find(filters)
      .populate("category", "name slug")
      .populate("provider", "name email")
      .sort(sortOption);

    res.json({ count: services.length, services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = { createCategory, getCategories, deleteCategory, getAllServices, };
