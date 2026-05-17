import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Images } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';
import api from '../../services/api';

const GalleryPreviewSection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gallery?limit=6')
      .then(({ data }) => setImages((data.data || data || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const placeholders = Array.from({ length: 6 }, (_, i) => ({ _id: `ph-${i}` }));
  const items = images.length > 0 ? images : (loading ? placeholders : []);

  return (
    <section className="section-y bg-white">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
          <SectionTitle
            eyebrow="Gallery"
            title="Our work in action"
            subtitle="A glimpse into our manufacturing facility and delivered packaging."
          />
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-orange font-semibold hover:gap-3 transition-all text-[14px]"
          >
            View Full Gallery <ArrowRight size={14} />
          </Link>
        </div>

        {items.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Images size={40} className="text-[#D1D5DB] mb-3" />
            <p className="text-[#6B7280] text-[14px]">Gallery coming soon.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5">
            {items.map((img, i) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                className="rounded-xl overflow-hidden bg-[#E5E7EB] aspect-[4/3]"
              >
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.title || 'Gallery image'}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full animate-pulse bg-[#E5E7EB]" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryPreviewSection;
