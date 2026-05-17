import { Search, X } from 'lucide-react';

const ProductFilter = ({ search, onSearch, categories, activeCategorySlug, onCategoryChange }) => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
    {/* Search */}
    <div className="relative flex-1 max-w-xs">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search products…"
        className="w-full pl-9 pr-8 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)] placeholder:text-[#9CA3AF]"
      />
      {search && (
        <button onClick={() => onSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-navy">
          <X size={14} />
        </button>
      )}
    </div>

    {/* Category pills */}
    {categories?.length > 0 && (
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors font-[family-name:var(--font-caption)] ${
            !activeCategorySlug ? 'bg-navy text-white' : 'bg-[#F3F4F6] text-om-gray hover:bg-[#E5E7EB]'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors font-[family-name:var(--font-caption)] ${
              activeCategorySlug === cat.slug ? 'bg-orange text-white' : 'bg-[#F3F4F6] text-om-gray hover:bg-[#E5E7EB]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default ProductFilter;
