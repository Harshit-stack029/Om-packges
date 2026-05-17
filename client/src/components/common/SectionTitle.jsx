import { motion } from 'framer-motion';

const SectionTitle = ({ eyebrow, title, subtitle, center = false, light = false }) => (
  <motion.div
    className={center ? 'text-center' : ''}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    {eyebrow && (
      <span className={`eyebrow inline-block mb-5 ${light ? 'text-orange' : 'text-orange'}`}>
        {eyebrow}
      </span>
    )}
    <h2 className={`h2 leading-[1.15] ${light ? 'text-white' : 'text-[#111827]'}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-6 text-[17px] leading-[1.75] prose-readable-lg ${center ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-[#6B7280]'}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionTitle;
