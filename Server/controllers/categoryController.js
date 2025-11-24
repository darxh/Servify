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
      message: "error.message",
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
    const category = await Category.deleteOne(req.parmas.id);

    if (category) {
      await Category.findOneAndDelete({ category });

      res.json({ message: "category removed successfully" });
    } else {
      res.status(404).json({ message: "category not found" });
    }
  } catch (error) {
    res.status(501).status({
      message: error.message,
    });
  }
};

module.exports = { createCategory, getCategories, deleteCategory };
