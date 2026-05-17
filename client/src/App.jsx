import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AdminLayout from './components/admin/AdminLayout';
import AnnouncementTicker from './components/common/AnnouncementTicker';
import CompactHeader from './components/common/CompactHeader';
import CategoryPillRow from './components/common/CategoryPillRow';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public pages — Home eager for fast first paint; rest code-split
import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductCategory = lazy(() => import('./pages/ProductCategory'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Industries = lazy(() => import('./pages/Industries'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Clients = lazy(() => import('./pages/Clients'));
const RequestQuote = lazy(() => import('./pages/RequestQuote'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages — lazy loaded (code split)
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminBlog = lazy(() => import('./pages/admin/Blog'));
const AdminGallery = lazy(() => import('./pages/admin/Gallery'));
const AdminCertificates = lazy(() => import('./pages/admin/Certificates'));
const AdminInquiries = lazy(() => import('./pages/admin/Inquiries'));
const AdminSubscribers = lazy(() => import('./pages/admin/Subscribers'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
  </div>
);

const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <AnnouncementTicker />
    <CompactHeader />
    <CategoryPillRow />
    <main className="flex-1">
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'var(--font-caption)', fontSize: '14px' },
            success: { iconTheme: { primary: '#e8621a', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
          <Route path="/products/:categorySlug" element={<PublicLayout><ProductCategory /></PublicLayout>} />
          <Route path="/products/:categorySlug/:productSlug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/industries" element={<PublicLayout><Industries /></PublicLayout>} />
          <Route path="/certifications" element={<PublicLayout><Certifications /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/clients" element={<PublicLayout><Clients /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/request-quote" element={<PublicLayout><RequestQuote /></PublicLayout>} />

          {/* ── Admin login (no public layout) ── */}
          <Route
            path="/admin/login"
            element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>}
          />

          {/* ── Protected admin routes — wrapped in AdminLayout ── */}
          <Route element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard"      element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
              <Route path="/admin/products"       element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
              <Route path="/admin/products/new"   element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
              <Route path="/admin/products/:id/edit" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
              <Route path="/admin/categories"     element={<Suspense fallback={<PageLoader />}><AdminCategories /></Suspense>} />
              <Route path="/admin/blog"           element={<Suspense fallback={<PageLoader />}><AdminBlog /></Suspense>} />
              <Route path="/admin/blog/new"       element={<Suspense fallback={<PageLoader />}><AdminBlog /></Suspense>} />
              <Route path="/admin/blog/:id/edit"  element={<Suspense fallback={<PageLoader />}><AdminBlog /></Suspense>} />
              <Route path="/admin/gallery"        element={<Suspense fallback={<PageLoader />}><AdminGallery /></Suspense>} />
              <Route path="/admin/certificates"   element={<Suspense fallback={<PageLoader />}><AdminCertificates /></Suspense>} />
              <Route path="/admin/inquiries"      element={<Suspense fallback={<PageLoader />}><AdminInquiries /></Suspense>} />
              <Route path="/admin/subscribers"    element={<Suspense fallback={<PageLoader />}><AdminSubscribers /></Suspense>} />
              <Route path="/admin/settings"       element={<Suspense fallback={<PageLoader />}><AdminSettings /></Suspense>} />
            </Route>
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
