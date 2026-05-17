import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

import SectionTitle from '../common/SectionTitle';
import TESTIMONIALS from '../../data/testimonials';

const Initials = ({ name }) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const TestimonialCard = ({ t }) => (
  <article className="bg-white rounded-2xl p-8 lg:p-12 h-full flex flex-col">
    <Quote size={32} className="text-orange/30" strokeWidth={1.5} />
    <blockquote className="mt-8 text-[18px] lg:text-[20px] leading-[1.7] text-[#111827] font-[family-name:var(--font-heading)] flex-1">
      &ldquo;{t.quote}&rdquo;
    </blockquote>
    <footer className="mt-10 flex items-center gap-4 pt-8 border-t border-[#E5E7EB]">
      <div className="w-12 h-12 rounded-full bg-[#FFF7ED] border border-orange/20 flex items-center justify-center flex-shrink-0">
        <span className="text-orange font-semibold text-[13px] tracking-wide">
          <Initials name={t.name} />
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-[#111827] font-[family-name:var(--font-heading)] truncate">{t.name}</p>
        <p className="text-[13px] text-[#6B7280] truncate">
          {t.role} · {t.company}
        </p>
      </div>
      <span className="ml-auto hidden sm:inline-flex text-[11px] uppercase tracking-[0.14em] text-[#6B7280] font-semibold">
        {t.industry}
      </span>
    </footer>
  </article>
);

const TestimonialsSection = () => {
  const swiperRef = useRef(null);

  return (
    <section className="section-y bg-[#FFF7ED] relative overflow-hidden">
      <div className="container-page">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <SectionTitle
              eyebrow="Customer Stories"
              title="What 80+ industrial clients say"
              subtitle="Long-term partnerships across electronics, pharma, automotive, FMCG and heavy machinery."
            />
          </div>
          <div className="lg:col-span-4 flex lg:justify-end gap-3">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:border-orange hover:text-orange transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:border-orange hover:text-orange transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="stack-section">
          <Swiper
            modules={[Autoplay, Pagination]}
            onSwiper={(s) => { swiperRef.current = s; }}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              768:  { slidesPerView: 1.4 },
              1024: { slidesPerView: 2 },
            }}
            autoplay={{ delay: 7500, disableOnInteraction: true }}
            loop
            pagination={{ clickable: true, bulletClass: 'om-bullet om-bullet-light', bulletActiveClass: 'om-bullet-active' }}
            className="!pb-16"
          >
            {TESTIMONIALS.map((t) => (
              <SwiperSlide key={t.id} className="h-auto">
                <TestimonialCard t={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
