import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO, { breadcrumbJsonLd } from '../components/common/SEO';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import {
  ChevronRight, Package, CheckCircle2, Home, ArrowRight, MessageCircle, Send,
  ShieldCheck, Truck, Award,
} from 'lucide-react';
import { motion } from 'framer-motion';
import InquiryForm from '../components/forms/InquiryForm';
import ProductCard from '../components/products/ProductCard';
import api from '../services/api';

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: 'ISO 9001 certified' },
  { icon: Award,       label: 'ISPM-15 export ready' },
  { icon: Truck,       label: 'Pan-India delivery' },
];

const whatsappLink = (productName) => {
  const text = `Hi OM Packaging, I'd like a quote for: ${productName}`;
  return `https://wa.me/919945266092?text=${encodeURIComponent(text)}`;
};

const Breadcrumbs = ({ product, catSlug }) => (
  <nav className="container-page pt-8 lg:pt-10">
    <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280] flex-wrap">
      <Link to="/" className="flex items-center gap-1 hover:text-orange transition-colors">
        <Home size={12} /> Home
      </Link>
      <ChevronRight size={12} />
      <Link to="/products" className="hover:text-orange transition-colors">Products</Link>
      {product.category && (
        <>
          <ChevronRight size={12} />
          <Link to={`/products/${catSlug}`} className="hover:text-orange transition-colors">
            {product.category.name}
          </Link>
        </>
      )}
      <ChevronRight size={12} />
      <span className="text-[#111827] font-medium line-clamp-1">{product.name}</span>
    </div>
  </nav>
);

const ProductDetail = () => {
  const { categorySlug, productSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.get(`/products/slug/${productSlug}`)
      .then(({ data }) => {
        const p = data.data || data;
        setProduct(p);
        setRelated(p.related || []);
      })
      .catch(() => navigate('/products', { replace: true }))
      .finally(() => setLoading(false));
  }, [productSlug, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const catSlug = categorySlug || product.category?.slug;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description || '',
    image: images.map((i) => i.url || i),
    sku: product.sku || product._id,
    brand: { '@type': 'Brand', name: 'OM Packaging' },
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      seller: { '@type': 'Organization', name: 'OM Packaging' },
    },
  };

  const breadcrumbsJson = breadcrumbJsonLd([
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    ...(product.category ? [{ label: product.category.name, path: `/products/${catSlug}` }] : []),
    { label: product.name, path: `/products/${catSlug}/${product.slug}` },
  ]);

  return (
    <>
      <SEO
        title={`${product.name} — OM Packaging`}
        description={product.shortDescription || `Custom ${product.name} from OM Packaging — ISO 9001 certified, PAN-India delivery, free quote in 24 hrs.`}
        image={images[0]?.url}
        type="product"
        jsonLd={[productJsonLd, breadcrumbsJson]}
      />

      <Breadcrumbs product={product} catSlug={catSlug} />

      {/* ─── Top: gallery + summary panel ─────────────────────────── */}
      <section className="pt-10 pb-20 lg:pt-14 lg:pb-28 bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              {images.length > 0 ? (
                <div className="space-y-4">
                  <Swiper
                    modules={[Thumbs, Navigation, SwiperPagination]}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    navigation
                    pagination={{ clickable: true }}
                    className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#FFF7ED]"
                  >
                    {images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  {images.length > 1 && (
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={12}
                      slidesPerView={Math.min(images.length, 5)}
                      watchSlidesProgress
                      className="thumbs-swiper"
                    >
                      {images.map((img, i) => (
                        <SwiperSlide key={i}>
                          <div className="aspect-square rounded-lg overflow-hidden bg-[#FFF7ED] cursor-pointer">
                            <img src={img.url} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-[#FFF7ED] flex items-center justify-center">
                  <Package size={72} className="text-orange/30" strokeWidth={1.2} />
                </div>
              )}
            </motion.div>

            {/* Summary panel */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 lg:sticky lg:top-32"
            >
              {product.category && (
                <Link
                  to={catSlug ? `/products/${catSlug}` : '/products'}
                  className="eyebrow inline-flex items-center gap-1 hover:underline"
                >
                  {product.category.name} <ChevronRight size={12} />
                </Link>
              )}

              <h1 className="mt-4 text-[#111827] font-bold tracking-[-0.02em] text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.15] font-[family-name:var(--font-heading)]">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="mt-6 text-[#6B7280] text-[16px] leading-[1.8]">
                  {product.shortDescription}
                </p>
              )}

              {/* CTAs (desktop — mobile uses sticky bar) */}
              <div className="mt-9 hidden lg:flex flex-wrap gap-3">
                <Link
                  to={`/request-quote?product=${encodeURIComponent(product.slug)}`}
                  className="btn btn-primary"
                >
                  <Send size={16} /> Get Quote
                </Link>
                <a
                  href={whatsappLink(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>

              {/* Trust badges */}
              <ul className="mt-10 pt-10 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-[13px] text-[#111827] font-medium">
                    <Icon size={16} className="text-orange flex-shrink-0" strokeWidth={1.7} />
                    {label}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Description / features / applications / specs ───────── */}
      <section className="section-y bg-[#FAFAFA]">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

            {/* Left: description + features + applications */}
            <div className="lg:col-span-7 space-y-14">
              {product.description && (
                <div>
                  <p className="eyebrow">About</p>
                  <h2 className="h3 text-[#111827] mt-3 mb-6">Product overview</h2>
                  <p className="text-[#6B7280] text-[16px] leading-[1.85] prose-readable-lg whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {product.features?.length > 0 && (
                <div>
                  <p className="eyebrow">Built-in</p>
                  <h2 className="h3 text-[#111827] mt-3 mb-6">Key features</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-[#111827]">
                        <CheckCircle2 size={18} className="text-orange flex-shrink-0 mt-0.5" strokeWidth={1.7} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.applications?.length > 0 && (
                <div>
                  <p className="eyebrow">Designed for</p>
                  <h2 className="h3 text-[#111827] mt-3 mb-6">Applications</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {product.applications.map((app, i) => (
                      <span
                        key={i}
                        className="bg-white text-[#111827] text-[13px] font-medium px-4 py-2 rounded-full border border-[#E5E7EB]"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: specifications table */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              {product.specifications?.length > 0 && (
                <div className="bg-white rounded-2xl p-8 lg:p-10">
                  <p className="eyebrow">Specifications</p>
                  <h3 className="h3 text-[#111827] mt-3 mb-7">Technical details</h3>
                  <dl className="divide-y divide-[#E5E7EB]">
                    {product.specifications.map(({ key, value }, i) => (
                      <div key={i} className="grid grid-cols-12 gap-4 py-3.5 first:pt-0 last:pb-0">
                        <dt className="col-span-5 text-[14px] text-[#6B7280] font-medium">{key}</dt>
                        <dd className="col-span-7 text-[14px] text-[#111827] font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Inline inquiry form (the second-chance CTA) ─────────── */}
      <section className="section-y bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-5">
              <p className="eyebrow">Request a Quote</p>
              <h2 className="h2 text-[#111827] mt-5 max-w-[16ch]">
                Get a tailored quote for {product.name.split(' ').slice(0, 4).join(' ')}.
              </h2>
              <p className="mt-7 text-[#6B7280] text-[16px] leading-[1.85] prose-readable">
                Tell us your dimensions, quantity and timeline. Our team responds within 24 business hours with pricing and lead time.
              </p>

              <ul className="mt-10 space-y-5">
                {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-[14px] text-[#111827]">
                    <Icon size={18} className="text-orange flex-shrink-0" strokeWidth={1.7} />
                    {label}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 group"
              >
                <span className="w-11 h-11 rounded-full bg-[#FFF7ED] border border-orange/20 flex items-center justify-center group-hover:bg-orange group-hover:border-orange transition-colors">
                  <MessageCircle size={18} className="text-orange group-hover:text-white transition-colors" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block font-semibold text-[#111827] text-[15px] group-hover:text-orange transition-colors">Or chat on WhatsApp</span>
                  <span className="block text-[#6B7280] text-[12px]">Quick reply, usually within minutes</span>
                </span>
              </a>
            </div>

            <div className="lg:col-span-7 bg-[#FFF7ED] rounded-2xl p-8 lg:p-12">
              <InquiryForm productName={product.name} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related products ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="section-y bg-[#FAFAFA]">
          <div className="container-page">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="eyebrow">More from {product.category?.name || 'this category'}</p>
                <h2 className="h2 text-[#111827] mt-5">Related products</h2>
              </div>
              {catSlug && (
                <Link
                  to={`/products/${catSlug}`}
                  className="inline-flex items-center gap-2 text-orange font-semibold hover:gap-3 transition-all text-[14px]"
                >
                  View all in {product.category?.name} <ArrowRight size={14} />
                </Link>
              )}
            </div>

            <div className="stack-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} categorySlug={catSlug} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Mobile sticky CTA bar — Get Quote + WhatsApp ─────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] flex gap-2.5 shadow-[0_-8px_24px_-12px_rgba(17,24,39,0.12)]">
        <Link
          to={`/request-quote?product=${encodeURIComponent(product.slug)}`}
          className="btn btn-primary flex-1 !h-11"
        >
          <Send size={15} /> Get Quote
        </Link>
        <a
          href={whatsappLink(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn !h-11 !px-5 bg-[#25D366] text-white hover:bg-[#1da851]"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={16} />
        </a>
      </div>

      {/* Spacer so mobile sticky bar doesn't cover footer / last content */}
      <div className="lg:hidden h-20" aria-hidden />
    </>
  );
};

export default ProductDetail;
