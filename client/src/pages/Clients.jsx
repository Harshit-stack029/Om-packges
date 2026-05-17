import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Quote, Star, ArrowRight } from 'lucide-react';
import PageHero from '../components/common/PageHero';

const CLIENTS = [
  'Bosch', 'Siemens', 'Tata Motors', 'L&T', 'Mahindra', 'Wipro',
  'Bharat Electronics', 'BHEL', 'Honeywell', 'ABB', 'Schneider',
  'Toyota', 'Volvo', 'Cipla', 'Sun Pharma', 'ITC',
];

const TESTIMONIALS = [
  {
    name: 'Rajeev Menon',
    role: 'Procurement Head',
    company: 'A leading automotive OEM',
    text: 'OM Packaging has been our wooden crate supplier for over six years. Their consistency on quality and delivery — especially for our export shipments — is what keeps us coming back.',
    rating: 5,
  },
  {
    name: 'Priya Iyer',
    role: 'Logistics Manager',
    company: 'An electronics manufacturer',
    text: 'We needed ESD-safe packaging at scale. The team designed custom inserts that fit our PCB modules perfectly. Zero damage claims since we switched.',
    rating: 5,
  },
  {
    name: 'Anand Krishnan',
    role: 'Supply Chain Director',
    company: 'A pharma logistics company',
    text: 'Their attention to detail on tamper-evident sealing and dimensional accuracy is exactly what regulated industries need. Honest pricing, no surprises.',
    rating: 5,
  },
  {
    name: 'Suresh Patil',
    role: 'Operations Manager',
    company: 'Industrial machinery exporter',
    text: 'ISPM-15 certified packaging delivered on time, every time. They handle our containers for Europe and Southeast Asia without a hitch.',
    rating: 5,
  },
];

const Clients = () => (
  <>
    <Helmet>
      <title>Our Clients — OM Packaging</title>
      <meta
        name="description"
        content="Trusted by 250+ Indian manufacturers across automotive, electronics, pharma, and exports. Testimonials and client logos."
      />
    </Helmet>

    <PageHero
      title="Our Clients"
      subtitle="Trusted by 250+ Indian manufacturers — from electronics OEMs to export houses."
      breadcrumbs={[{ label: 'Clients' }]}
    />

    {/* Client logos / names grid */}
    <section className="container-page section-y">
      <div className="text-center mb-12">
        <p className="text-orange text-xs uppercase tracking-wider font-bold mb-3 font-[family-name:var(--font-heading)]">Companies we work with</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-navy font-[family-name:var(--font-heading)] mb-3">
          A snapshot of our customer base
        </h2>
        <p className="text-om-gray text-base font-[family-name:var(--font-caption)] max-w-2xl mx-auto">
          We serve manufacturers across India — from large OEMs to mid-sized exporters. Here are a few we're proud to support.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CLIENTS.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: (i % 4) * 0.04 }}
            className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-7 flex items-center justify-center hover:border-orange/30 hover:shadow-sm transition-all"
          >
            <span className="text-navy font-bold text-sm sm:text-base tracking-tight font-[family-name:var(--font-heading)] text-center">
              {name}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-om-gray text-xs italic mt-6 font-[family-name:var(--font-caption)]">
        Client names shown are representative. Specific identities are protected under NDA where applicable.
      </p>
    </section>

    {/* Testimonials */}
    <section className="bg-light-gray section-y">
      <div className="container-page">
        <div className="text-center mb-12">
          <p className="text-orange text-xs uppercase tracking-wider font-bold mb-3 font-[family-name:var(--font-heading)]">What they say</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-navy font-[family-name:var(--font-heading)]">In their words</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 2) * 0.08 }}
              className="bg-white rounded-2xl p-6 lg:p-7 relative"
            >
              <Quote size={36} className="text-orange/20 absolute top-5 right-5" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={14} fill="#e8621a" className="text-orange" />
                ))}
              </div>
              <p className="text-navy text-base leading-relaxed font-[family-name:var(--font-caption)] mb-5 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange font-bold font-[family-name:var(--font-heading)]">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-navy text-sm font-[family-name:var(--font-heading)]">{t.name}</p>
                  <p className="text-om-gray text-xs font-[family-name:var(--font-caption)]">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-navy py-14">
      <div className="container-page flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white font-[family-name:var(--font-heading)] mb-1">
            Join the list of companies we serve.
          </h2>
          <p className="text-white/60 text-sm font-[family-name:var(--font-caption)]">
            Request a free site visit and see why 250+ manufacturers trust OM Packaging.
          </p>
        </div>
        <Link to="/request-quote" className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white font-semibold px-6 py-3.5 rounded-lg transition-colors font-[family-name:var(--font-heading)] whitespace-nowrap">
          Get a Quote <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  </>
);

export default Clients;
