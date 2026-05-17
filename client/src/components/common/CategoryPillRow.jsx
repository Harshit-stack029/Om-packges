import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../services/api';

const FALLBACK = [
  { _id: 'wp', name: 'Wooden Packaging',     slug: 'wooden-packaging' },
  { _id: 'cp', name: 'Corrugated Packaging', slug: 'corrugated-packaging' },
  { _id: 'ip', name: 'Industrial Packaging', slug: 'industrial-packaging' },
  { _id: 'ep', name: 'Export Packaging',     slug: 'export-packaging' },
];

const CategoryPillRow = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => {
        const list = data.data || data || [];
        setCategories(list.length ? list : FALLBACK);
      })
      .catch(() => setCategories(FALLBACK));
  }, []);

  if (!categories.length) return null;

  return (
    <div className="bg-white border-b border-[#E5E7EB]">
      <div className="container-page">
        <div className="flex items-center gap-2 sm:gap-3 py-3 overflow-x-auto scrollbar-hide -mx-2 px-2">
          <NavLink
            to="/products"
            end
            className={({ isActive }) =>
              `flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#1B2A4A] text-white'
                  : 'bg-[#FFF7ED] text-[#111827] hover:bg-orange hover:text-white'
              }`
            }
          >
            All Products
          </NavLink>
          {categories.map((cat) => (
            <NavLink
              key={cat._id}
              to={`/products/${cat.slug}`}
              className={({ isActive }) =>
                `flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-orange text-white'
                    : 'bg-[#FFF7ED] text-[#111827] hover:bg-orange hover:text-white'
                }`
              }
            >
              {cat.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPillRow;
