import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * breadcrumbs: [{ label: 'Products', to: '/products' }, { label: 'Wooden Packaging' }]
 * Last item (no `to`) is the current page — rendered as plain text.
 * image: optional imported asset — renders as full-bleed background with overlay.
 */
const PageHero = ({ title, subtitle, breadcrumbs = [], image }) => {
  const hasImage = Boolean(image);

  return (
    <section className={`relative overflow-hidden ${hasImage ? '' : 'bg-[#FFF7ED]'}`}>
      {/* Background image */}
      {hasImage && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            width="1920"
            height="600"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1A33]/80 via-[#0F1A33]/60 to-[#0F1A33]/30" />
        </>
      )}

      {/* Ambient flourish — only on plain bg */}
      {!hasImage && (
        <div className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-white/50 blur-3xl" />
      )}

      <div className="container-page py-28 lg:py-40 relative">
        {breadcrumbs.length > 0 && (
          <nav className={`flex items-center gap-1.5 text-[12px] mb-10 flex-wrap ${hasImage ? 'text-white/70' : 'text-[#6B7280]'}`}>
            <Link
              to="/"
              className={`flex items-center gap-1 transition-colors ${hasImage ? 'hover:text-white' : 'hover:text-orange'}`}
            >
              <Home size={12} /> Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight size={12} />
                {crumb.to
                  ? <Link to={crumb.to} className={`transition-colors ${hasImage ? 'hover:text-white' : 'hover:text-orange'}`}>{crumb.label}</Link>
                  : <span className={`font-medium ${hasImage ? 'text-white' : 'text-[#111827]'}`}>{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`h1 max-w-3xl ${hasImage ? 'text-white' : 'text-[#111827]'}`}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className={`mt-8 text-[18px] leading-[1.8] prose-readable-lg ${hasImage ? 'text-white/80' : 'text-[#6B7280]'}`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
