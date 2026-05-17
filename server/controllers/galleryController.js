import GalleryItem from '../models/GalleryItem.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/gallery — public
export const getGallery = async (req, res, next) => {
  try {
    const { tag, featured, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (tag && tag !== 'all') filter.tag = tag;
    if (featured === 'true') filter.isFeatured = true;

    const total = await GalleryItem.countDocuments(filter);
    const items = await GalleryItem.find(filter)
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: items, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// GET /api/gallery/tags — public, distinct tags
export const getTags = async (req, res, next) => {
  try {
    const tags = await GalleryItem.distinct('tag');
    res.json({ success: true, data: tags.filter(Boolean) });
  } catch (err) { next(err); }
};

// POST /api/gallery — admin
export const createItem = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required.' });
    const { title, description, tag, isFeatured, order } = req.body;
    const item = await GalleryItem.create({
      title, description,
      tag: tag || 'General',
      isFeatured: isFeatured === 'true',
      order: Number(order) || 0,
      url: req.file.path,
      publicId: req.file.filename,
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

// PUT /api/gallery/:id — admin (metadata only; image replacement is delete + create)
export const updateItem = async (req, res, next) => {
  try {
    const { title, description, tag, isFeatured, order } = req.body;
    const item = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(tag !== undefined && { tag }),
        ...(isFeatured !== undefined && { isFeatured: isFeatured === 'true' }),
        ...(order !== undefined && { order: Number(order) }),
      },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

// DELETE /api/gallery/:id — admin
export const deleteItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    await cloudinary.uploader.destroy(item.publicId).catch(() => {});
    await item.deleteOne();
    res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (err) { next(err); }
};
