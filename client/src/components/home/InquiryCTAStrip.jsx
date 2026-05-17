import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const InquiryCTAStrip = () => (
  <section className="section-y-lg bg-orange text-white relative overflow-hidden">
    {/* Subtle texture flourish */}
    <div className="pointer-events-none absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-black/10 blur-3xl" />

    <div className="container-page relative text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="inline-flex items-center gap-3 text-white/85 text-[12px] font-semibold tracking-[0.18em]">
          <span className="inline-block w-7 h-px bg-white/60" />
          READY TO ORDER?
        </p>
        <h2 className="mt-6 text-white font-bold tracking-[-0.02em] leading-[1.1] text-[32px] sm:text-[40px] lg:text-[52px] max-w-[20ch] mx-auto font-[family-name:var(--font-heading)]">
          Need a custom packaging solution?
        </h2>
        <p className="mt-7 text-white/85 text-[17px] lg:text-[19px] leading-[1.7] max-w-2xl mx-auto">
          Tell us your requirements — our packaging engineers respond within 24 business hours with a tailored quote.
        </p>

        <div className="mt-11 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/request-quote"
            className="btn bg-white text-orange hover:bg-[#111827] hover:text-white !h-12 !px-7"
          >
            Request a Quote <ArrowRight size={16} />
          </Link>
          <a
            href="https://wa.me/919945266092?text=Hello%2C%20I%27d%20like%20a%20packaging%20quote"
            target="_blank"
            rel="noopener noreferrer"
            className="btn border-white/40 text-white hover:bg-white hover:text-orange hover:border-white !h-12 !px-7"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default InquiryCTAStrip;
