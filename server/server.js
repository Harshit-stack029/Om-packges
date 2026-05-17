import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { publicCache, noCache } from './middleware/cacheMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { sitemap, robots } from './controllers/sitemapController.js';

connectDB();

const app = express();

// Security headers
app.use(helmet());

// Response compression (gzip/brotli)
app.use(compression());

// Trust proxy (one hop — for nginx/load balancer)
app.set('trust proxy', 1);

// CORS — allow frontend origins.
// Production frontend is hosted at ompack.rhobel.com.
// In development we allow any http://localhost:* and http://127.0.0.1:* so
// vite port fallbacks (5173 → 5174 → …) don't break local dev.
// Extra prod origins can be added via CORS_EXTRA_ORIGINS (comma-separated).
const allowedOrigins = [
  'http://localhost:5173',
  'https://ompack.rhobel.com',
  'https://www.ompack.in',
  'https://ompack.in',
  ...(process.env.CORS_EXTRA_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
];
const isDevLocalhost = (origin) =>
  process.env.NODE_ENV !== 'production' &&
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin) || isDevLocalhost(origin)) {
        return cb(null, true);
      }
      cb(new Error(`CORS policy violation: ${origin}`));
    },
    credentials: true,
  })
);

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
  })
);

// Health check
app.get('/api/health', (_req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = dbStates[mongoose.connection.readyState] || 'unknown';
  const healthy = mongoose.connection.readyState === 1;
  res.status(healthy ? 200 : 503).json({
    success: healthy,
    message: 'OM Packaging API is running.',
    env: process.env.NODE_ENV,
    uptime: Math.round(process.uptime()),
    db: dbState,
    timestamp: new Date().toISOString(),
  });
});

// SEO — dynamic sitemap + robots fallback
app.get('/sitemap.xml', sitemap);
app.get('/robots.txt', robots);

// Routes
// Auth + admin/inquiry — never cache (sensitive or write-heavy)
app.use('/api/auth',       noCache,         authRoutes);
app.use('/api/inquiries',  noCache,         inquiryRoutes);
app.use('/api/newsletter', noCache,         newsletterRoutes);
app.use('/api/admin',      noCache,         adminRoutes);
// Public content — short browser cache
app.use('/api/categories',   publicCache(60),  categoryRoutes);
app.use('/api/products',     publicCache(60),  productRoutes);
app.use('/api/blog',         publicCache(60),  blogRoutes);
app.use('/api/gallery',      publicCache(120), galleryRoutes);
app.use('/api/certificates', publicCache(300), certificateRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
