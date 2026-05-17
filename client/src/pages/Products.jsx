import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHero from '../components/common/PageHero';
import CTABanner from '../components/common/CTABanner';
import productsHero from '../assets/products-hero.webp';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';
import api from '../services/api';

const CategoryCard = ({ category, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.07 }}
  >
    <Link to={`/products/${category.slug}`} className="group block">
      <div className="aspect-[4/5] bg-[#FFF7ED] rounded-2xl overflow-hidden">
        {category.coverImage ? (
          <img
            src={category.coverImage}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-80">{category.icon || '📦'}</span>
          </div>
        )}
      </div>
      <div className="pt-8">
        <h2 className="text-[20px] font-semibold text-[#111827] font-[family-name:var(--font-heading)] group-hover:text-orange transition-colors">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-[#6B7280] text-[15px] mt-3 leading-[1.8] line-clamp-2">
            {category.description}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-orange font-semibold text-[13px] mt-7 group-hover:gap-2.5 transition-all">
          Browse Products <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  </motion.div>
);

const CategorySkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-[4/5] rounded-2xl bg-[#E5E7EB]" />
    <div className="pt-8 space-y-3">
      <div className="h-5 bg-[#E5E7EB] rounded w-3/4" />
      <div className="h-3 bg-[#E5E7EB] rounded w-full" />
      <div className="h-3 bg-[#E5E7EB] rounded w-5/6" />
    </div>
  </div>
);

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || data || []))
      .catch(() => {})
      .finally(() => setLoadingCats(false));

    api.get('/products?featured=true&limit=8')
      .then(({ data }) => setFeatured(data.data || []))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Products — OM Packaging</title>
        <meta name="description" content="Browse OM Packaging's full range of industrial packaging products — wooden crates, corrugated boxes, pallets, and more." />
      </Helmet>

      <PageHero
        title="Our Products"
        subtitle="Industrial-grade packaging engineered for every requirement — from lightweight corrugated to heavy-duty timber."
        breadcrumbs={[{ label: 'Products' }]}
        image={productsHero}
      />

      {/* ─── Featured products row ──────────────────────────────── */}
      {(loadingFeatured || featured.length > 0) && (
        <section className="section-y bg-white">
          <div className="container-page">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="eyebrow">Featured</p>
                <h2 className="h2 text-[#111827] mt-5">Bestsellers</h2>
              </div>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 text-orange font-semibold hover:gap-3 transition-all text-[14px]"
              >
                Need a custom quote? <ArrowRight size={14} />
              </Link>
            </div>

            <div className="stack-section">
              {loadingFeatured ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                  {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                  {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Category grid ──────────────────────────────────────── */}
      <section className="section-y bg-[#FAFAFA]">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Browse by category</p>
            <h2 className="h2 text-[#111827] mt-5">Shop by packaging type</h2>
            <p className="mt-7 text-[#6B7280] text-[16px] leading-[1.8]">
              Pick a category to see the full range, specs, and applications across each product line.
            </p>
          </div>

          <div className="stack-section">
            {loadingCats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {Array.from({ length: 6 }).map((_, i) => <CategorySkeletonCard key={i} />)}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#6B7280] text-[14px]">No product categories available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                {categories.map((cat, i) => (
                  <CategoryCard key={cat._id} category={cat} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
};

export default Products;
