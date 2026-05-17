import { PackageOpen } from 'lucide-react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/LoadingSkeleton';

const ProductGrid = ({ products, loading, categorySlug, emptyMessage = 'No products found.' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageOpen size={48} className="text-[#D1D5DB] mb-4" strokeWidth={1.4} />
        <p className="text-[#6B7280] text-[14px]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} categorySlug={categorySlug} index={i} />
      ))}
    </div>
  );
};

export default ProductGrid;
