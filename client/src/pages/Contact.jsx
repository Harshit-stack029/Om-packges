import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import InquiryForm from '../components/forms/InquiryForm';
import SEO, { breadcrumbJsonLd } from '../components/common/SEO';
import contactHero from '../assets/contact-hero.webp';

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: [
      'No. 15, Dhana Lakshmi Layout',
      'Vidhyaranya Pura, K.G. Shyamarajapura',
      'Bengaluru — 560097, Karnataka',
    ],
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+91 99452 66092'],
    link: 'tel:+919945266092',
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['info@ompackagings.in'],
    link: 'mailto:info@ompackagings.in',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon – Sat · 9:00 AM – 7:00 PM', 'Sunday: Closed'],
  },
];

const Contact = () => (
  <>
    <SEO
      title="Contact OM Packaging — Bengaluru Industrial Packaging"
      description="Get in touch with OM Packaging for custom industrial packaging solutions. Call, email, or fill the inquiry form — response within 24 hours."
      jsonLd={breadcrumbJsonLd([{ label: 'Home', path: '/' }, { label: 'Contact', path: '/contact' }])}
    />

    <PageHero
      title="Get in Touch"
      subtitle="Have a packaging requirement? Talk to us — we respond within 24 hours."
      breadcrumbs={[{ label: 'Contact' }]}
      image={contactHero}
    />

    <section className="section-y bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
          {/* Contact info column — open list, no card frames */}
          <aside className="lg:col-span-5">
            <p className="eyebrow">Contact details</p>
            <h2 className="h2 text-[#111827] mt-5 max-w-[16ch]">Talk to our team.</h2>
            <p className="mt-6 text-[16px] text-[#6B7280] leading-[1.8] prose-readable">
              Choose what works best — we respond within 24 business hours.
            </p>

            <ul className="mt-14 space-y-10">
              {CONTACT_INFO.map(({ icon: Icon, title, lines, link }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex gap-5"
                >
                  <Icon size={22} className="text-orange flex-shrink-0 mt-1" strokeWidth={1.6} />
                  <div className="min-w-0">
                    <p className="text-[12px] uppercase tracking-[0.14em] text-[#6B7280] font-semibold mb-2">{title}</p>
                    {lines.map((line, idx) => (
                      <p key={idx} className="text-[#111827] text-[15px] leading-[1.8]">
                        {idx === 0 && link ? (
                          <a href={link} className="hover:text-orange transition-colors font-medium">{line}</a>
                        ) : line}
                      </p>
                    ))}
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* WhatsApp callout — single accent, lots of space */}
            <a
              href="https://wa.me/919945266092"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-14 inline-flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF7ED] border border-orange/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange group-hover:border-orange transition-colors">
                <MessageCircle size={20} className="text-orange group-hover:text-white transition-colors" strokeWidth={1.6} />
              </div>
              <div>
                <p className="font-semibold text-[15px] text-[#111827] group-hover:text-orange transition-colors">Chat on WhatsApp</p>
                <p className="text-[#6B7280] text-[13px] mt-0.5">Quick reply within minutes</p>
              </div>
            </a>
          </aside>

          {/* Form column */}
          <div className="lg:col-span-7">
            <div className="bg-[#FFF7ED] rounded-2xl p-8 lg:p-12">
              <p className="eyebrow">Send us a message</p>
              <h2 className="h3 text-[#111827] mt-4 mb-3">Tell us what you need.</h2>
              <p className="text-[#6B7280] text-[15px] leading-[1.8] mb-10">
                Fill the form below and our team will reach out shortly.
              </p>
              <InquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Map — full bleed, no border-top so it flows naturally */}
    <section>
      <div className="aspect-[16/7] w-full bg-[#FFF7ED]">
        <iframe
          title="OM Packagings — K.G. Shyamarajapura, Bengaluru"
          src="https://www.google.com/maps?q=Om+Packagings,+Dhana+Lakshmi+Layout,+Vidhyaranya+Pura,+Shamarajapur,+Bengaluru,+Karnataka+560097&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  </>
);

export default Contact;
