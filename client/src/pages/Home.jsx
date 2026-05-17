import SEO, { ORG_JSON_LD } from '../components/common/SEO';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import CategoryShowcaseSection from '../components/home/CategoryShowcaseSection';
import CompactTrustStrip from '../components/home/CompactTrustStrip';
import WhyChooseUsCompact from '../components/home/WhyChooseUsCompact';
import IndustriesStrip from '../components/home/IndustriesStrip';
import TestimonialsSection from '../components/home/TestimonialsSection';
import GalleryPreviewSection from '../components/home/GalleryPreviewSection';
import NewsletterSection from '../components/home/NewsletterSection';
import InquiryCTAStrip from '../components/home/InquiryCTAStrip';

const Home = () => (
  <>
    <SEO
      title="OM Packaging — Industrial Packaging Solutions, Bengaluru"
      description="Custom industrial packaging — wooden crates, corrugated boxes, pallets. ISO 9001 certified, ISPM-15 export packaging. PAN-India delivery. Free quote in 24 hrs."
      keywords="industrial packaging Bengaluru, wooden crates, corrugated boxes, pallets, ISPM-15, ISO certified packaging"
      jsonLd={ORG_JSON_LD}
    />

    {/* 1. Hero banner slider */}
    <HeroSlider />

    {/* 2. Featured products — primary catalog landing block */}
    <FeaturedProductsSection />

    {/* 3. Category showcase (2x2) */}
    <CategoryShowcaseSection />

    {/* 4. Trust strip — compact, single row */}
    <CompactTrustStrip />

    {/* 5. Why Choose Us — compact 4-card row */}
    <WhyChooseUsCompact />

    {/* 6. Industries strip — horizontal scroll */}
    <IndustriesStrip />

    {/* 7. Testimonials slider */}
    <TestimonialsSection />

    {/* 8. Gallery preview — 6 images */}
    <GalleryPreviewSection />

    {/* 9a. Newsletter (preserved from Phase 2) */}
    <NewsletterSection />

    {/* 9b. Inquiry CTA strip — full-width orange, final action band before footer */}
    <InquiryCTAStrip />
  </>
);

export default Home;
