import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';
import api from '../../services/api';

// Per-slug fallback imagery (Unsplash) for when the admin hasn't uploaded a cover.
const FALLBACK_IMG = {
  'wooden-packaging':     'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&w=1200&q=80',
  'corrugated-packaging': 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80',
  'industrial-packaging': 'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=1200&q=80',
  'export-packaging':     'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80',
  default:                'https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=1200&q=80',
};

const FALLBACK_CATEGORIES = [
  { _id: 'wp', name: 'Wooden Packaging',     slug: 'wooden-packaging',
    description: 'Custom crates, boxes & pallets — built for heavy loads and export.' },
  { _id: 'cp', name: 'Corrugated Packaging', slug: 'corrugated-packaging',
    description: 'Lightweight, printable boxes for retail, FMCG and electronics.' },
  { _id: 'ip', name: 'Industrial Packaging', slug: 'industrial-packaging',
    description: 'Heavy-duty solutions for machinery, components and equipment.' },
  { _id: 'ep', name: 'Export Packaging',     slug: 'export-packaging',
    description: 'ISPM-15 certified heat-treated wood, accepted in 180+ countries.' },
];

const CategoryCard = ({ category, index }) => {
  const img = category.coverImage || FALLBACK_IMG[category.slug] || FALLBACK_IMG.default;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 2) * 0.08 }}
    >
      <Link
        to={`/products/${category.slug}`}
        className="group relative block overflow-hidden rounded-2xl bg-[#1B2A4A] min-h-[280px] lg:min-h-[320px]"
      >
        <img
          src={img}
          alt={category.name}
          width="800"
          height="600"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-[1.05] group-hover:opacity-75 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A33]/95 via-[#0F1A33]/40 to-transparent" />

        <div className="relative h-full flex flex-col justify-end p-7 lg:p-9 min-h-[280px] lg:min-h-[320px]">
          <h3 className="font-semibold text-white text-[22px] lg:text-[26px] font-[family-name:var(--font-heading)] leading-tight">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-white/75 text-[14px] leading-[1.7] mt-3 max-w-md line-clamp-2">
              {category.description}
            </p>
          )}
          <span className="inline-flex items-center gap-2 text-orange font-semibold mt-5 text-[14px] group-hover:gap-3 transition-all">
            Explore <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

const CategoryShowcaseSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories?limit=4')
      .then(({ data }) => {
        const list = (data.data || data || []).slice(0, 4);
        setCategories(list.length ? list : FALLBACK_CATEGORIES);
      })
      .catch(() => setCategories(FALLBACK_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  const items = loading ? FALLBACK_CATEGORIES : categories;

  return (
    <section className="section-y bg-white">
      <div className="container-page">
        <SectionTitle
          eyebrow="Shop by Category"
          title="Built for every industrial need"
          subtitle="Pick a category to see the full range, specs and applications."
        />

        <div className="mt-14 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {items.slice(0, 4).map((cat, i) => (
            <CategoryCard key={cat._id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcaseSection;
