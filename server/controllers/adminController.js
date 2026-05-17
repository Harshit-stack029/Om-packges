import Product from '../models/Product.js';
import Category from '../models/Category.js';
import BlogPost from '../models/BlogPost.js';
import GalleryItem from '../models/GalleryItem.js';
import Certificate from '../models/Certificate.js';
import Inquiry from '../models/Inquiry.js';
import Subscriber from '../models/Subscriber.js';

// GET /api/admin/stats — Admin dashboard stats
export const getStats = async (req, res, next) => {
  try {
    const [
      totalProducts, activeProducts, featuredProducts,
      totalCategories, activeCategories,
      totalBlogs, publishedBlogs,
      totalGallery, featuredGallery,
      totalCerts, activeCerts,
      totalInquiries, newInquiries, recentInquiries,
      totalSubscribers, activeSubscribers, recentSubscribers,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isFeatured: true }),
      Category.countDocuments(),
      Category.countDocuments({ isActive: true }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ isPublished: true }),
      GalleryItem.countDocuments(),
      GalleryItem.countDocuments({ isFeatured: true }),
      Certificate.countDocuments(),
      Certificate.countDocuments({ isActive: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).select('name company email productInterest status createdAt'),
      Subscriber.countDocuments(),
      Subscriber.countDocuments({ isActive: true }),
      Subscriber.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select('email source createdAt'),
    ]);

    res.json({
      success: true,
      data: {
        products:    { total: totalProducts,    active: activeProducts, featured: featuredProducts },
        categories:  { total: totalCategories,  active: activeCategories },
        blogs:       { total: totalBlogs,       published: publishedBlogs },
        gallery:     { total: totalGallery,     featured: featuredGallery },
        certificates:{ total: totalCerts,       active: activeCerts },
        inquiries:   { total: totalInquiries,   new: newInquiries, recent: recentInquiries },
        subscribers: { total: totalSubscribers, active: activeSubscribers, recent: recentSubscribers },
      },
    });
  } catch (err) {
    next(err);
  }
};
