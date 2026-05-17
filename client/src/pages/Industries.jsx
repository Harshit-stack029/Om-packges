import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Cpu, Car, Pill, Cog, ShoppingBag, Wrench,
  Plane, Zap, ArrowRight, CheckCircle2,
} from 'lucide-react';
import PageHero from '../components/common/PageHero';
import SEO, { breadcrumbJsonLd } from '../components/common/SEO';
import industriesHero from '../assets/industries-hero.webp';

const INDUSTRIES = [
  {
    icon: Cpu,
    name: 'Electronics & Components',
    description: 'Anti-static foam-lined crates, ESD-safe corrugated, and custom inserts for PCBs, modules, and finished electronics.',
    products: ['ESD-safe inserts', 'Foam-lined crates', 'Anti-static corrugated'],
    color: 'from-blue-500/20 to-blue-500/5',
  },
  {
    icon: Car,
    name: 'Automotive & Auto-Components',
    description: 'Heavy-duty wooden crates, returnable pallets, and engineered packaging for engines, transmissions, and aftermarket parts.',
    products: ['Returnable pallets', 'Engine crates', 'Multi-tier corrugated'],
    color: 'from-orange/20 to-orange/5',
  },
  {
    icon: Pill,
    name: 'Pharma & Healthcare',
    description: 'Cleanroom-grade corrugated boxes, temperature-mapped crates, and tamper-evident packaging for regulated logistics.',
    products: ['Tamper-evident boxes', 'Cold-chain crates', 'Cleanroom corrugated'],
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    icon: Cog,
    name: 'Heavy Machinery',
    description: 'Reinforced wooden crates, skid-mounted bases, and ISPM-15 heat-treated packaging for export of large machinery.',
    products: ['Reinforced crates', 'Skid bases', 'ISPM-15 packaging'],
    color: 'from-slate-500/20 to-slate-500/5',
  },
  {
    icon: ShoppingBag,
    name: 'FMCG & Consumer Goods',
    description: 'High-volume corrugated boxes, multi-pack solutions, and branded printed packaging for retail-ready shipping.',
    products: ['Multi-pack boxes', 'Printed corrugated', 'Retail-ready packs'],
    color: 'from-pink-500/20 to-pink-500/5',
  },
  {
    icon: Wrench,
    name: 'Industrial Equipment',
    description: 'Custom-built wooden crates for tools, motors, pumps, and bulky industrial equipment with shock-absorbing inserts.',
    products: ['Custom crates', 'Shock-absorbing inserts', 'Heavy-duty pallets'],
    color: 'from-amber-500/20 to-amber-500/5',
  },
  {
    icon: Plane,
    name: 'Export & Logistics',
    description: 'ISPM-15 certified wooden packaging, sea-worthy crates, and dimension-optimized pallets for international shipments.',
    products: ['ISPM-15 certified', 'Sea-worthy crates', 'Export pallets'],
    color: 'from-cyan-500/20 to-cyan-500/5',
  },
  {
    icon: Zap,
    name: 'Energy & Power',
    description: 'Specialized packaging for transformers, switchgear, solar panels, and battery modules with custom protection.',
    products: ['Transformer crates', 'Solar panel boxes', 'Battery packaging'],
    color: 'from-yellow-500/20 to-yellow-500/5',
  },
];

const Industries = () => (
  <>
    <SEO
      title="Industries We Serve — OM Packaging"
      description="OM Packaging serves electronics, automotive, pharma, heavy machinery, FMCG, exports, and more. Custom packaging engineered for each industry's needs."
      jsonLd={breadcrumbJsonLd([{ label: 'Home', path: '/' }, { label: 'Industries', path: '/industries' }])}
    />

    <PageHero
      title="Industries We Serve"
      subtitle="From electronics to heavy machinery — packaging engineered for what you ship."
      breadcrumbs={[{ label: 'Industries' }]}
      image={industriesHero}
    />

    <section className="section-y bg-white">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">Our Reach</p>
          <h2 className="h2 text-[#111827] mt-5">
            Specialized packaging for every industry
          </h2>
          <p className="mt-8 text-[#6B7280] text-[17px] leading-[1.85] prose-readable-lg">
            We don't believe in one-size-fits-all. Each industry has unique challenges — fragile components, heavy weights, temperature sensitivity, export regulations. We engineer packaging that fits the product, route, and end-user.
          </p>
        </div>

        <div className="stack-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {INDUSTRIES.map(({ icon: Icon, name, description, products, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${color} aspect-[16/10] rounded-2xl flex items-center justify-center mb-8`}>
                <Icon size={64} strokeWidth={1.2} className="text-[#111827]/60" />
              </div>
              <h3 className="font-semibold text-[#111827] text-[20px] mb-3 font-[family-name:var(--font-heading)] group-hover:text-orange transition-colors">
                {name}
              </h3>
              <p className="text-[#6B7280] text-[15px] leading-[1.8] mb-6">
                {description}
              </p>
              <ul className="space-y-2.5">
                {products.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[13px] text-[#111827] font-medium">
                    <CheckCircle2 size={14} className="text-orange flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA strip */}
    <section className="section-y-lg bg-[#FFF7ED]">
      <div className="container-narrow text-center">
        <p className="eyebrow">Bespoke engineering</p>
        <h2 className="h2 text-[#111827] mt-5 max-w-[20ch] mx-auto">
          Don't see your industry?
        </h2>
        <p className="mt-8 text-[#6B7280] text-[17px] leading-[1.8] max-w-xl mx-auto">
          We've packaged everything from precision medical devices to 5-tonne industrial pumps. Tell us what you ship — we'll engineer the right packaging for it.
        </p>
        <Link to="/contact" className="btn btn-primary mt-12">
          Talk to Our Team <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  </>
);

export default Industries;
