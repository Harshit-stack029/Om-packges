import { motion } from 'framer-motion';
import { Ruler, FileCheck, Clock, MapPin } from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

const REASONS = [
  { icon: Ruler,     title: 'Custom Engineering', desc: 'Designed to your exact dimensions and load specs.' },
  { icon: FileCheck, title: 'Quality Certified',  desc: 'ISO 9001 processes — full traceability per batch.' },
  { icon: Clock,     title: 'On-Time Delivery',   desc: 'Streamlined production and logistics across India.' },
  { icon: MapPin,    title: 'Export Compliance',  desc: 'ISPM-15 heat-treated wood accepted in 180+ countries.' },
];

const WhyChooseUsCompact = () => (
  <section className="section-y bg-white">
    <div className="container-page">
      <SectionTitle
        eyebrow="Why OM Packagings"
        title="The benchmark for industrial packaging"
        subtitle="Precision manufacturing, quality certifications and a client-first approach."
        center
      />

      <div className="mt-14 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-5xl mx-auto">
        {REASONS.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="text-center"
          >
            <Icon size={28} className="text-orange mx-auto mb-5" strokeWidth={1.6} />
            <h4 className="font-semibold text-[#111827] text-[16px] mb-2.5 font-[family-name:var(--font-heading)]">
              {title}
            </h4>
            <p className="text-[#6B7280] text-[14px] leading-[1.7]">
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUsCompact;
