import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/common/PageHero';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';
import CTABanner from '../components/common/CTABanner';
import api from '../services/api';

const ProductCategory = () => {
  const { categorySlug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on search/category change
  useEffect(() => { setPage(1); }, [categorySlug, debouncedSearch]);

  // Fetch category metadata
  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => {
        const cats = data.data || data || [];
        setCategory(cats.find((c) => c.slug === categorySlug) || null);
      })
      .catch(() => {});
  }, [categorySlug]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ category: categorySlug, page, limit: 12 });
    if (debouncedSearch) params.set('search', debouncedSearch);

    api.get(`/products?${params}`)
      .then(({ data }) => {
        setProducts(data.data || data?.products || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categorySlug, debouncedSearch, page]);

  const handleSearch = useCallback((val) => setSearch(val), []);

  return (
    <>
      <Helmet>
        <title>{category?.name ? `${category.name} — OM Packaging` : 'Products — OM Packaging'}</title>
        {category?.description && <meta name="description" content={category.description} />}
      </Helmet>

      <PageHero
        title={category?.name || 'Products'}
        subtitle={category?.description}
        breadcrumbs={[
          { label: 'Products', to: '/products' },
          { label: category?.name || categorySlug },
        ]}
      />

      <section className="section-y bg-white">
        <div className="container-page">
          {/* Filter bar */}
          <div className="mb-14">
            <ProductFilter
              search={search}
              onSearch={handleSearch}
              categories={[]}
              activeCategorySlug={categorySlug}
              onCategoryChange={() => {}}
            />
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            categorySlug={categorySlug}
            emptyMessage={debouncedSearch ? `No products match "${debouncedSearch}".` : 'No products in this category yet.'}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-[14px] font-semibold transition-colors ${
                    p === page
                      ? 'bg-orange text-white'
                      : 'bg-white border border-[#E5E7EB] text-[#111827] hover:border-orange/40 hover:text-orange'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
};

export default ProductCategory;
