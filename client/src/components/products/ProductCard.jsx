import { Link } from 'react-router-dom';
import { ArrowRight, Star, Package } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Catalog product card.
 * - Square image (aspect-square), object-cover, slight zoom on hover.
 * - No border. White background. shadow-sm → shadow-md on hover.
 * - Whole card clickable → product detail page.
 * - "Get Quote →" link in orange below the description (cards have no price field).
 */
const ProductCard = ({ product, categorySlug, index = 0 }) => {
  const slug = categorySlug || product.category?.slug || 'all';
  const cover = product.images?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.06 }}
    >
      <Link
        to={`/products/${slug}/${product.slug}`}
        className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="relative aspect-video bg-[#FFF7ED] overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={product.name}
              width="640"
              height="360"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={42} className="text-orange/30" strokeWidth={1.3} />
            </div>
          )}
          {product.isFeatured && (
            <span className="absolute top-3 left-3 bg-red text-white text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <Star size={9} fill="white" strokeWidth={0} /> Featured
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-[#111827] text-[15px] leading-snug font-[family-name:var(--font-heading)] group-hover:text-orange transition-colors line-clamp-2 min-h-[2.6em]">
            {product.name}
          </h3>
          <p className="text-[13px] text-[#6B7280] mt-2 line-clamp-1 leading-[1.6]">
            {product.shortDescription || product.category?.name || 'Custom industrial packaging'}
          </p>
          <span className="inline-flex items-center gap-1.5 text-orange text-[13px] font-semibold mt-4 group-hover:gap-2.5 transition-all">
            Get Quote <ArrowRight size={13} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
