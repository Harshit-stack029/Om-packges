import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import CTABanner from '../components/common/CTABanner';
import api from '../services/api';
import galleryHero from '../assets/gallery-hero.webp';

/* ─── Lightbox ────────────────────────────────────────────────── */
const Lightbox = ({ item, onClose }) => {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X size={20} />
        </button>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-4xl w-full"
        >
          <img
            src={item.url}
            alt={item.title || 'Gallery image'}
            className="w-full max-h-[80vh] object-contain rounded-xl"
          />
          {(item.title || item.description) && (
            <div className="mt-3 text-center">
              {item.title && <p className="text-white font-semibold font-[family-name:var(--font-heading)]">{item.title}</p>}
              {item.description && <p className="text-white/60 text-sm mt-1 font-[family-name:var(--font-caption)]">{item.description}</p>}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Gallery item card ───────────────────────────────────────── */
const GalleryCard = ({ item, index, onOpen }) => (
  <motion.div
    className="group relative overflow-hidden rounded-xl bg-[#E5E7EB] cursor-pointer"
    initial={{ opacity: 0, scale: 0.97 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay: index * 0.04 }}
    onClick={() => onOpen(item)}
  >
    <img
      src={item.url}
      alt={item.title || 'Gallery image'}
      className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-colors duration-300 flex items-center justify-center">
      <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    {item.isFeatured && (
      <span className="absolute top-2 left-2 bg-orange text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
        Featured
      </span>
    )}
  </motion.div>
);

/* ─── Gallery page ────────────────────────────────────────────── */
const Gallery = () => {
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/gallery/tags')
      .then(({ data }) => setTags(data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 60 });
    if (activeTag !== 'all') params.set('tag', activeTag);
    api.get(`/gallery?${params}`)
      .then(({ data }) => setItems(data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeTag]);

  const handleOpen = useCallback((item) => setLightbox(item), []);
  const handleClose = useCallback(() => setLightbox(null), []);

  return (
    <>
      <Helmet>
        <title>Gallery — OM Packaging</title>
        <meta name="description" content="See OM Packaging's manufacturing facility and delivered solutions in our photo gallery." />
      </Helmet>

      <PageHero
        title="Our Gallery"
        subtitle="A visual tour of our facility, processes, and packaging solutions."
        breadcrumbs={[{ label: 'Gallery' }]}
        image={galleryHero}
      />

      <section className="section-y bg-white">
        <div className="container-page">
          {/* Tag filter */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-14">
              <button
                onClick={() => setActiveTag('all')}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-colors font-[family-name:var(--font-caption)] ${activeTag === 'all' ? 'bg-[#111827] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#111827]/30'}`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-colors font-[family-name:var(--font-caption)] ${activeTag === tag ? 'bg-orange text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-orange/30'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-[#E5E7EB] animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🖼️</p>
              <p className="text-om-gray font-[family-name:var(--font-caption)]">No gallery images yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item, i) => (
                <GalleryCard key={item._id} item={item} index={i} onOpen={handleOpen} />
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && <Lightbox item={lightbox} onClose={handleClose} />}

      <CTABanner />
    </>
  );
};

export default Gallery;
