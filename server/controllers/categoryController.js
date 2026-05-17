import Category from '../models/Category.js';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/categories  — Public
export const getCategories = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.active !== 'false') filter.isActive = true; // default: active only

    const categories = await Category.find(filter).sort({ order: 1, name: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:id  — Admin
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// POST /api/categories  — Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, order, isActive } = req.body;

    const data = {
      name,
      description,
      icon,
      order: Number(order) || 0,
      isActive: isActive !== 'false' && isActive !== false,
    };

    if (req.file) {
      data.coverImage = req.file.path;
      data.coverImagePublicId = req.file.filename;
    }

    const category = await Category.create(data);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// PUT /api/categories/:id  — Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    const { name, description, icon, order, isActive } = req.body;
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (order !== undefined) category.order = Number(order);
    if (isActive !== undefined) category.isActive = isActive !== 'false' && isActive !== false;

    if (req.file) {
      // Delete old cover image from Cloudinary
      if (category.coverImagePublicId) {
        await cloudinary.uploader.destroy(category.coverImagePublicId).catch(() => {});
      }
      category.coverImage = req.file.path;
      category.coverImagePublicId = req.file.filename;
    }

    await category.save();
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id  — Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${productCount} product(s) reference this category. Reassign or delete them first.`,
      });
    }

    if (category.coverImagePublicId) {
      await cloudinary.uploader.destroy(category.coverImagePublicId).catch(() => {});
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
};
