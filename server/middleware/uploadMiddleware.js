import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_FILE_MIMES = [...ALLOWED_IMAGE_MIMES, 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `om-packaging/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

const imageFilter = (_req, file, cb) => {
  if (ALLOWED_IMAGE_MIMES.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only JPG, PNG, and WebP images are allowed.'));
};

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_FILE_MIMES.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only JPG, PNG, WebP images and PDF files are allowed.'));
};

// Products — up to 8 images
export const uploadProductImages = multer({
  storage: makeStorage('products'),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: imageFilter,
}).array('images', 8);

// Blog cover image — single
export const uploadBlogCover = multer({
  storage: makeStorage('blogs'),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: imageFilter,
}).single('coverImage');

// Gallery — single image
export const uploadGalleryImage = multer({
  storage: makeStorage('gallery'),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: imageFilter,
}).single('image');

// Certificates — PDF or image
export const uploadCertificate = multer({
  storage: makeStorage('certificates'),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: fileFilter,
}).single('file');

// Category cover image — single
export const uploadCategoryImage = multer({
  storage: makeStorage('categories'),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: imageFilter,
}).single('coverImage');

// Inquiry attachments — memory storage (forwarded as email attachment)
export const uploadInquiryAttachment = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: fileFilter,
}).single('attachment');
