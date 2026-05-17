import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const SLIDES = [
  {
    eyebrow: 'OM PACKAGING',
    title: 'Custom Industrial Packaging Solutions',
    sub: 'Wooden crates, corrugated boxes & export packaging — built to your specs.',
    primary: { label: 'Get Quote',         to: '/request-quote' },
    secondary: { label: 'Explore Products', to: '/products' },
    image: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=1920&q=80',
  },
  {
    eyebrow: 'EXPORT READY',
    title: 'ISPM-15 Certified Export Packaging',
    sub: 'Heat-treated wooden crates ready for international shipping.',
    primary: { label: 'Get Quote',                to: '/request-quote' },
    secondary: { label: 'View Wooden Packaging', to: '/products/wooden-packaging' },
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1920&q=80',
  },
  {
    eyebrow: 'TRUSTED BY 80+ CLIENTS',
    title: 'Bulk Orders, Pan-India Delivery',
    sub: '15+ years serving electronics, medical, automotive & FMCG.',
    primary: { label: 'Get Quote',     to: '/request-quote' },
    secondary: { label: 'View Clients', to: '/clients' },
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80',
  },
];

const Slide = ({ slide }) => (
  <div className="relative h-[55vh] lg:h-[70vh] min-h-[420px] lg:min-h-[560px] overflow-hidden">
    {/* Full-bleed image */}
    <img
      src={slide.image}
      alt=""
      width="1920"
      height="1080"
      loading="eager"
      decoding="async"
      fetchpriority="high"
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Left-to-right gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

    {/* Content */}
    <div className="relative h-full container-page flex items-center">
      <div className="max-w-xl lg:max-w-2xl">
        <p className="inline-flex items-center gap-3 text-orange text-[12px] font-semibold tracking-[0.18em]">
          <span className="inline-block w-7 h-px bg-orange" />
          {slide.eyebrow}
        </p>
        <h1 className="mt-5 text-white font-bold tracking-[-0.02em] leading-[1.08] text-[32px] sm:text-[44px] lg:text-[60px] font-[family-name:var(--font-heading)]">
          {slide.title}
        </h1>
        <p className="mt-6 text-white/85 text-[15px] lg:text-[19px] leading-[1.7] max-w-lg">
          {slide.sub}
        </p>
        <div className="mt-8 lg:mt-10 flex flex-wrap gap-3">
          <Link to={slide.primary.to} className="btn btn-primary">
            {slide.primary.label} <ArrowRight size={16} />
          </Link>
          <Link
            to={slide.secondary.to}
            className="btn border-white/30 text-white hover:bg-white hover:text-[#111827] hover:border-white"
          >
            {slide.secondary.label}
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const HeroSlider = () => {
  const ref = useRef(null);

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, bulletClass: 'om-bullet', bulletActiveClass: 'om-bullet-active' }}
        loop
        onSwiper={(s) => { ref.current = s; }}
        className="om-hero"
      >
        {SLIDES.map((s, i) => (
          <SwiperSlide key={i}><Slide slide={s} /></SwiperSlide>
        ))}
      </Swiper>

      {/* Prev / Next arrows — hidden on mobile */}
      <button
        type="button"
        onClick={() => ref.current?.slidePrev()}
        aria-label="Previous slide"
        className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 text-white items-center justify-center transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => ref.current?.slideNext()}
        aria-label="Next slide"
        className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 text-white items-center justify-center transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
};

export default HeroSlider;
