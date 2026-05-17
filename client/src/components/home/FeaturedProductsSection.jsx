import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import SectionTitle from '../common/SectionTitle';
import ProductCard from '../products/ProductCard';
import api from '../../services/api';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
    <div className="aspect-square bg-[#E5E7EB]" />
    <div className="p-5 space-y-2.5">
      <div className="h-4 bg-[#E5E7EB] rounded w-3/4" />
      <div className="h-3 bg-[#E5E7EB] rounded w-2/3" />
      <div className="h-3 bg-[#E5E7EB] rounded w-1/3 mt-3" />
    </div>
  </div>
);

const FeaturedProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true&limit=12')
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-y bg-[#FAFAFA]">
      <div className="container-page">
        <SectionTitle
          eyebrow="Featured Products"
          title="Our Best-Selling Solutions"
          subtitle="Hand-picked from our active catalog — engineered, certified, and proven across 80+ industrial clients."
        />

        <div className="mt-14 lg:mt-16">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package size={36} className="text-[#D1D5DB] mx-auto mb-4" strokeWidth={1.4} />
              <p className="text-[#6B7280] text-[14px]">No featured products yet — check back soon.</p>
              <Link to="/products" className="btn btn-ghost mt-6">Browse full catalog</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-orange font-semibold hover:gap-3 transition-all text-[14px]"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
