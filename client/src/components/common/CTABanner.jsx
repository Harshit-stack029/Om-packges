import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CTABanner = ({
  title = 'Ready to get started?',
  subtitle = 'Contact our team for a custom quote tailored to your packaging requirements.',
  buttonText = 'Request a Quote',
  buttonTo = '/request-quote',
  secondaryText = 'View Products',
  secondaryTo = '/products',
}) => (
  <section className="section-y-lg bg-[#FFF7ED]">
    <div className="container-page text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="h2 text-[#111827] max-w-[22ch] mx-auto">{title}</h2>
        <p className="mt-8 text-[18px] leading-[1.8] text-[#6B7280] max-w-xl mx-auto">
          {subtitle}
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={buttonTo} className="btn btn-primary">
            {buttonText} <ArrowRight size={16} />
          </Link>
          {secondaryTo && (
            <Link to={secondaryTo} className="btn btn-ghost">
              {secondaryText}
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;
