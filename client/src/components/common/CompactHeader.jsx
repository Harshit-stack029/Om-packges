import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import api from '../../services/api';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About' },
  { to: '/products',  label: 'Products', mega: true },
  { to: '/industries',     label: 'Industries' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/gallery',   label: 'Gallery' },
  { to: '/blog',      label: 'Blog' },
  { to: '/contact',   label: 'Contact' },
];

const CompactHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const closeTimer = useRef();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileProductsOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lazy-load mega-menu data the first time desktop OR mobile mega expands.
  useEffect(() => {
    const shouldLoad = (megaOpen || mobileProductsOpen) && categories.length === 0;
    if (!shouldLoad) return;
    api.get('/categories').then(({ data }) => setCategories(data.data || data || []))
      .catch(() => {});
    // Featured products are only used in the desktop mega-menu — fetch on demand.
    if (megaOpen) {
      api.get('/products?featured=true&limit=3')
        .then(({ data }) => setFeatured(data.data || []))
        .catch(() => {});
    }
  }, [megaOpen, mobileProductsOpen, categories.length]);

  const openMega   = () => { clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMega  = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 120); };

  const linkClass = ({ isActive }) =>
    `relative text-[14px] font-medium transition-colors duration-150 ${
      isActive ? 'text-orange' : 'text-[#111827] hover:text-orange'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow duration-200 border-t-[3px] border-t-[#C0392B] ${
        scrolled ? 'shadow-[0_1px_0_0_#E5E7EB,0_8px_24px_-16px_rgba(17,24,39,0.06)]' : 'border-b border-[#E5E7EB]'
      }`}
    >
      <div className="container-page">
        <div className="flex items-center justify-between gap-8 h-[68px] lg:h-[76px]">
          {/* Logo — left */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Right group: Nav + Phone + CTA (all right-aligned) */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-9">
            <nav className="flex items-center gap-6 xl:gap-7">
              {NAV_LINKS.map((link) =>
                link.mega ? (
                  <div
                    key={link.to}
                    className="relative"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                  >
                    <NavLink to={link.to} className={linkClass}>
                      {({ isActive }) => (
                        <span className="inline-flex items-center gap-1">
                          {link.label}
                          <ChevronDown size={14} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                          {isActive && <span className="absolute -bottom-[26px] left-0 right-0 h-[2px] bg-orange rounded-full" />}
                        </span>
                      )}
                    </NavLink>
                  </div>
                ) : (
                  <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && <span className="absolute -bottom-[26px] left-0 right-0 h-[2px] bg-orange rounded-full" />}
                      </>
                    )}
                  </NavLink>
                )
              )}
            </nav>

            <a href="tel:+919945266092" className="hidden xl:inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-orange transition-colors whitespace-nowrap">
              <Phone size={14} className="text-orange" />
              +91 99452 66092
            </a>

            <Link to="/request-quote" className="btn btn-primary btn-sm whitespace-nowrap">
              Get Quote <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile right-side: Quote + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/request-quote" className="btn btn-primary btn-sm !h-9 !px-3 !text-[12px]">
              Get Quote
            </Link>
            <button
              className="p-2 rounded-md text-[#111827] hover:bg-[#FFF7ED] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega-menu — two columns: categories + featured products */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-t border-[#E5E7EB] shadow-[0_18px_40px_-24px_rgba(17,24,39,0.18)]"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <div className="container-page py-12">
              <div className="grid grid-cols-12 gap-12">
                {/* Categories column */}
                <div className="col-span-7">
                  <p className="eyebrow mb-6">Browse by category</p>
                  {categories.length === 0 ? (
                    <p className="text-[#6B7280] text-[14px]">Loading categories…</p>
                  ) : (
                    <ul className="grid grid-cols-2 gap-x-10 gap-y-4">
                      {categories.map((cat) => (
                        <li key={cat._id}>
                          <Link
                            to={`/products/${cat.slug}`}
                            className="group flex items-center justify-between py-2 text-[15px] text-[#111827] hover:text-orange transition-colors"
                          >
                            <span className="font-medium">{cat.name}</span>
                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 mt-8 text-orange text-[14px] font-semibold hover:gap-3 transition-all"
                  >
                    View all products <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Featured products column */}
                <div className="col-span-5">
                  <p className="eyebrow mb-6">Featured</p>
                  {featured.length === 0 ? (
                    <p className="text-[#6B7280] text-[13px]">No featured products yet.</p>
                  ) : (
                    <ul className="space-y-5">
                      {featured.map((p) => (
                        <li key={p._id}>
                          <Link
                            to={`/products/${p.category?.slug || 'all'}/${p.slug}`}
                            className="flex items-center gap-4 group"
                          >
                            <div className="w-16 h-16 rounded-lg bg-[#FFF7ED] overflow-hidden flex-shrink-0">
                              {p.images?.[0]?.url && (
                                <img
                                  src={p.images[0].url}
                                  alt={p.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[14px] font-medium text-[#111827] group-hover:text-orange transition-colors line-clamp-1">
                                {p.name}
                              </p>
                              {p.shortDescription && (
                                <p className="text-[12px] text-[#6B7280] line-clamp-1 mt-0.5">{p.shortDescription}</p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-[#E5E7EB] bg-white"
          >
            <nav className="container-page py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                // Special-case the Products row: render an accordion with categories.
                if (link.mega) {
                  return (
                    <div key={link.to}>
                      <button
                        type="button"
                        onClick={() => setMobileProductsOpen((v) => !v)}
                        aria-expanded={mobileProductsOpen}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-[15px] font-medium text-[#111827] hover:bg-[#FFF7ED] transition-colors"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={16}
                          className={`text-[#6B7280] transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <ul className="pl-3 pr-1 pb-1 pt-1 space-y-0.5">
                              <li>
                                <NavLink
                                  to={link.to}
                                  end
                                  className={({ isActive }) =>
                                    `flex items-center justify-between px-3 py-2.5 rounded-md text-[14px] transition-colors ${
                                      isActive ? 'bg-[#FFF7ED] text-orange font-semibold' : 'text-[#111827] hover:bg-[#FFF7ED]'
                                    }`
                                  }
                                >
                                  All products
                                  <ArrowRight size={13} className="text-[#9CA3AF]" />
                                </NavLink>
                              </li>
                              {categories.length === 0 ? (
                                <li className="px-3 py-2.5 text-[13px] text-[#6B7280]">Loading categories…</li>
                              ) : (
                                categories.map((cat) => (
                                  <li key={cat._id}>
                                    <NavLink
                                      to={`/products/${cat.slug}`}
                                      className={({ isActive }) =>
                                        `flex items-center justify-between px-3 py-2.5 rounded-md text-[14px] transition-colors ${
                                          isActive ? 'bg-[#FFF7ED] text-orange font-semibold' : 'text-[#6B7280] hover:bg-[#FFF7ED] hover:text-[#111827]'
                                        }`
                                      }
                                    >
                                      {cat.name}
                                      <ArrowRight size={13} className="text-[#9CA3AF]" />
                                    </NavLink>
                                  </li>
                                ))
                              )}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `block px-3 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                        isActive ? 'bg-[#FFF7ED] text-orange' : 'text-[#111827] hover:bg-[#FFF7ED]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                );
              })}

              <a
                href="tel:+919945266092"
                className="mt-4 inline-flex items-center gap-2 px-3 py-3 text-[14px] text-[#6B7280] border-t border-[#E5E7EB]"
              >
                <Phone size={14} className="text-orange" />
                +91 99452 66092
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default CompactHeader;
