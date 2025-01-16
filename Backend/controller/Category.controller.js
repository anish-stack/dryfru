const Category = require('../models/Category.model');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ message: "Categories fetched successfully", categories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category fetched successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    }
};
