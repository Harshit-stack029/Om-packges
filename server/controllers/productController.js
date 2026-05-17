import Product from '../models/Product.js';
import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

const parseJSON = (str, fallback = []) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

const buildImages = (files = []) =>
  files.map((f) => ({ url: f.path, publicId: f.filename }));

// ── Public ────────────────────────────────────────────────────────────────────

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { category, featured, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Related products — same category, different product, max 4
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select('name slug images shortDescription category');

    res.json({ success: true, data: product, related });
  } catch (err) {
    next(err);
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

// GET /api/products/admin/all — Admin list (includes inactive)
export const getProductsAdmin = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, count: products.length, total, data: products });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/admin/:id — Admin single
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products — Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name, categoryId, description, shortDescription,
      isActive, isFeatured, specifications, features, applications,
    } = req.body;

    const product = await Product.create({
      name,
      category: categoryId,
      description,
      shortDescription,
      isActive: isActive !== 'false' && isActive !== false,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      specifications: parseJSON(specifications),
      features: parseJSON(features),
      applications: parseJSON(applications),
      images: buildImages(req.files),
    });

    await product.populate('category', 'name slug');
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    // Clean up uploaded images if creation fails
    if (req.files?.length) {
      await Promise.allSettled(
        req.files.map((f) => cloudinary.uploader.destroy(f.filename))
      );
    }
    next(err);
  }
};

// PUT /api/products/:id — Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const {
      name, categoryId, description, shortDescription,
      isActive, isFeatured, specifications, features, applications,
      imagesToRemove,  // JSON string: array of publicIds to delete
    } = req.body;

    // Delete removed images from Cloudinary
    const toRemove = parseJSON(imagesToRemove);
    if (toRemove.length) {
      await Promise.allSettled(toRemove.map((pid) => cloudinary.uploader.destroy(pid)));
      product.images = product.images.filter((img) => !toRemove.includes(img.publicId));
    }

    // Append newly uploaded images
    if (req.files?.length) {
      product.images.push(...buildImages(req.files));
    }

    if (name !== undefined) product.name = name;
    if (categoryId !== undefined) product.category = categoryId;
    if (description !== undefined) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (isActive !== undefined) product.isActive = isActive !== 'false' && isActive !== false;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (specifications !== undefined) product.specifications = parseJSON(specifications);
    if (features !== undefined) product.features = parseJSON(features);
    if (applications !== undefined) product.applications = parseJSON(applications);

    await product.save();
    await product.populate('category', 'name slug');
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id — Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Delete all Cloudinary images
    if (product.images.length) {
      await Promise.allSettled(
        product.images.map((img) => cloudinary.uploader.destroy(img.publicId))
      );
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id/toggle — Admin (quick active/featured toggle)
export const toggleProductField = async (req, res, next) => {
  try {
    const { field } = req.body;
    if (!['isActive', 'isFeatured'].includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid field.' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    product[field] = !product[field];
    await product.save();
    res.json({ success: true, data: { _id: product._id, [field]: product[field] } });
  } catch (err) {
    next(err);
  }
};
