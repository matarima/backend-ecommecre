const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).send("Error retrieving categories");
  }
};

exports.postCategory = async (req, res) => {
  try {
    const { name, children } = req.body;
    const newCategory = new Category({ name, children });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).send("Error creating category");
  }
};
