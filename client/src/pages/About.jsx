import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Users, Factory, Award, TrendingUp, ArrowRight } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import SEO, { breadcrumbJsonLd } from '../components/common/SEO';
import aboutHero from '../assets/about-hero.webp';

const VALUES = [
  { icon: Heart, title: 'Customer First', text: 'Every quote, every delivery — we treat your timeline as ours.' },
  { icon: Award, title: 'Quality Without Compromise', text: 'ISO-grade materials, audited at every stage.' },
  { icon: Users, title: 'Built on Trust', text: 'Decade-long relationships with 250+ industrial clients.' },
  { icon: TrendingUp, title: 'Always Improving', text: 'New machines, leaner processes, better outcomes.' },
];

const STATS = [
  { value: '15+', label: 'Years in Operation' },
  { value: '250+', label: 'Industrial Clients' },
  { value: '50K+', label: 'Units Shipped Monthly' },
  { value: '99.2%', label: 'On-time Delivery' },
];

const TIMELINE = [
  { year: '2009', title: 'Founded in Bengaluru', text: 'Started as a small wooden crate workshop in Peenya.' },
  { year: '2013', title: 'Expanded to corrugated', text: 'Added corrugated box manufacturing to serve electronics clients.' },
  { year: '2017', title: 'ISO 9001 certified', text: 'Formalized quality management system across operations.' },
  { year: '2020', title: 'ISPM-15 accredited', text: 'Heat treatment chamber installed — export-ready packaging.' },
  { year: '2024', title: '50,000 units / month', text: 'Crossed monthly capacity milestone across all product lines.' },
];

const About = () => (
  <>
    <SEO
      title="About OM Packaging — Industrial Packaging Since 2009"
      description="OM Packaging — Bengaluru-based industrial packaging manufacturer since 2009. ISO 9001 certified, ISPM-15 accredited, serving 250+ clients across India."
      jsonLd={breadcrumbJsonLd([{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }])}
    />

    <PageHero
      title="About OM Packaging"
      subtitle="Industrial packaging that protects your products — and your reputation."
      breadcrumbs={[{ label: 'About' }]}
      image={aboutHero}
    />

    {/* Intro */}
    <section className="section-y bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow">Our Story</p>
            <h2 className="h2 text-[#111827] mt-5 max-w-[18ch]">
              Built in Bengaluru. Trusted across India.
            </h2>
            <div className="mt-10 space-y-6 text-[#6B7280] text-[17px] leading-[1.85] prose-readable-lg">
              <p>
                OM Packaging started in 2009 as a small wooden crate workshop in Peenya. Today, we're a full-service industrial packaging manufacturer — supplying wooden crates, corrugated boxes, pallets, and custom solutions to over 250 manufacturers across India.
              </p>
              <p>
                Every product that leaves our factory carries our name. That's why we audit materials, train our workers, and refuse to cut corners — even when it costs us.
              </p>
              <p>
                We work with electronics OEMs, automotive suppliers, pharma logistics, machinery exporters, and FMCG brands. Our packaging isn't generic — it's engineered around what your product needs and where it has to go.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#111827] via-[#111827] to-orange/60 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Factory size={120} className="text-white/15" strokeWidth={1.2} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="eyebrow text-orange">Since 2009</p>
                  <p className="font-semibold text-[20px] mt-3 font-[family-name:var(--font-heading)]">Peenya Industrial Area</p>
                  <p className="text-white/60 text-[14px] mt-1">Bengaluru, Karnataka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-[#FFF7ED] py-20 lg:py-28">
      <div className="container-page grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <p className="text-[44px] lg:text-[56px] font-bold text-[#111827] leading-none font-[family-name:var(--font-heading)]">{s.value}</p>
            <p className="text-[#6B7280] text-[13px] mt-4 uppercase tracking-[0.12em]">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Mission / Vision */}
    <section className="section-y bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <div className="w-14 h-14 rounded-xl bg-[#FFF7ED] flex items-center justify-center mb-7">
              <Target size={24} className="text-orange" strokeWidth={1.7} />
            </div>
            <p className="eyebrow">Our Mission</p>
            <h3 className="h3 text-[#111827] mt-4 max-w-[18ch]">Engineered for what you make.</h3>
            <p className="mt-6 text-[#6B7280] text-[16px] leading-[1.85] prose-readable">
              Deliver dependable, custom-engineered packaging that keeps Indian manufacturers' products safe — from the factory floor to the customer's door.
            </p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-xl bg-[#FFF7ED] flex items-center justify-center mb-7">
              <Eye size={24} className="text-orange" strokeWidth={1.7} />
            </div>
            <p className="eyebrow">Our Vision</p>
            <h3 className="h3 text-[#111827] mt-4 max-w-[18ch]">South India's most trusted partner.</h3>
            <p className="mt-6 text-[#6B7280] text-[16px] leading-[1.85] prose-readable">
              Known for quality, on-time delivery, and packaging that's engineered, not assembled — for clients who can't afford to compromise.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section-y bg-[#FFF7ED]">
      <div className="container-page">
        <div className="text-center max-w-[36rem] mx-auto">
          <p className="eyebrow">What we stand for</p>
          <h2 className="h2 text-[#111827] mt-5">Our Values</h2>
        </div>
        <div className="stack-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Icon size={26} className="text-orange mb-6" strokeWidth={1.6} />
              <h3 className="font-semibold text-[#111827] text-[17px] mb-3 font-[family-name:var(--font-heading)]">{title}</h3>
              <p className="text-[#6B7280] text-[14px] leading-[1.8]">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section-y bg-white">
      <div className="container-page">
        <div className="text-center max-w-[36rem] mx-auto">
          <p className="eyebrow">Milestones</p>
          <h2 className="h2 text-[#111827] mt-5">Our Journey</h2>
        </div>
        <div className="stack-section relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-[#E5E7EB]" />
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="relative flex items-start gap-6 mb-12 last:mb-0"
            >
              {/* Year label — right-aligned, pr-4 keeps text clear of the dot */}
              <div className="w-[4.5rem] flex-shrink-0 text-right pt-0.5 pr-4">
                <span className="text-orange text-[13px] font-semibold font-[family-name:var(--font-heading)] tracking-[0.08em]">
                  {item.year}
                </span>
              </div>
              {/* Dot centred on the line */}
              <div className="absolute left-[4.5rem] -translate-x-1/2 top-1.5 w-3 h-3 rounded-full bg-orange ring-4 ring-white" />
              {/* Content */}
              <div className="flex-1 pl-4">
                <h3 className="font-semibold text-[#111827] text-[19px] mb-2 font-[family-name:var(--font-heading)]">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] text-[15px] leading-[1.8]">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-y-lg bg-[#111827]">
      <div className="container-page flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        <div className="max-w-xl">
          <h2 className="h2 text-white">Want to work with us?</h2>
          <p className="mt-6 text-white/60 text-[17px] leading-[1.8]">Talk to our team — we'll send a custom quote within 24 hours.</p>
        </div>
        <Link to="/request-quote" className="btn btn-primary flex-shrink-0">
          Request a Quote <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  </>
);

export default About;
