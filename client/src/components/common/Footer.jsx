import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock,
  Send, ShieldCheck, Award, Truck, Leaf,
  CheckCircle2,
} from 'lucide-react';

// Inline brand SVGs — Lucide dropped brand icons over trademark concerns.
const BrandIcon = ({ kind, size = 16 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', xmlns: 'http://www.w3.org/2000/svg' };
  switch (kind) {
    case 'linkedin':
      return (
        <svg {...props}>
          <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7.12 19H4V9.5h3.12V19zM5.56 8.27a1.81 1.81 0 1 1 0-3.62 1.81 1.81 0 0 1 0 3.62zM20 19h-3.12v-4.94c0-1.18-.02-2.7-1.65-2.7-1.66 0-1.91 1.29-1.91 2.62V19H10.2V9.5h3v1.3h.04c.42-.79 1.45-1.62 2.99-1.62 3.2 0 3.79 2.1 3.79 4.84V19z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...props}>
          <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.75 8.43-4.91 8.43-9.93z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...props}>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.85 5.85 0 0 0-2.13 1.39 5.85 5.85 0 0 0-1.38 2.13C.33 4.91.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.14.56 2.91a5.85 5.85 0 0 0 1.39 2.13c.66.66 1.32 1.07 2.13 1.38.77.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.14-.26 2.91-.56a5.85 5.85 0 0 0 2.13-1.39 5.85 5.85 0 0 0 1.38-2.13c.3-.77.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.14-.56-2.91a5.85 5.85 0 0 0-1.39-2.13A5.85 5.85 0 0 0 19.86.63c-.77-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
          <path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
          <circle cx="18.41" cy="5.59" r="1.44" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...props}>
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.13-2.14C19.49 3.5 12 3.5 12 3.5s-7.49 0-9.37.55A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.13 2.14c1.88.55 9.37.55 9.37.55s7.49 0 9.37-.55a3.02 3.02 0 0 0 2.13-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z" />
        </svg>
      );
    default:
      return null;
  }
};
import toast from 'react-hot-toast';
import Logo from './Logo';
import api from '../../services/api';

const PRODUCT_LINKS = [
  { label: 'Wooden Packaging',     to: '/products/wooden-packaging' },
  { label: 'Corrugated Packaging', to: '/products/corrugated-packaging' },
  { label: 'Industrial Packaging', to: '/products/industrial-packaging' },
  { label: 'Export Packaging',     to: '/products/export-packaging' },
];

const QUICK_LINKS = [
  { label: 'About Us',          to: '/about' },
  { label: 'Industries Served', to: '/industries' },
  { label: 'Certifications',    to: '/certifications' },
  { label: 'Gallery',           to: '/gallery' },
  { label: 'Blog',              to: '/blog' },
  { label: 'Contact Us',        to: '/contact' },
];

const SOCIALS = [
  { kind: 'linkedin',  href: 'https://www.linkedin.com',  label: 'LinkedIn'  },
  { kind: 'facebook',  href: 'https://www.facebook.com',  label: 'Facebook'  },
  { kind: 'instagram', href: 'https://www.instagram.com', label: 'Instagram' },
  { kind: 'youtube',   href: 'https://www.youtube.com',   label: 'YouTube'   },
];

const CERTIFICATIONS = [
  { Icon: ShieldCheck, label: 'ISO 9001:2015' },
  { Icon: Award,       label: 'ISPM-15 Certified' },
  { Icon: Truck,       label: 'Pan-India Network' },
  { Icon: Leaf,        label: 'FSC-Graded Wood' },
];

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const Heading = ({ children }) => (
  <h4 className="font-semibold text-[12px] uppercase tracking-[0.16em] text-[#111827] mb-7">{children}</h4>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-[14px] text-[#6B7280] hover:text-orange transition-colors"
  >
    {children}
  </Link>
);

const NewsletterStrip = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/newsletter', { email, source: 'footer' });
      setDone(true);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 text-[14px] text-[#111827]">
        <CheckCircle2 size={18} className="text-orange flex-shrink-0" strokeWidth={1.7} />
        Subscribed. Thanks for staying in touch.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md" noValidate>
      <label className="relative flex-1">
        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 h-11 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] text-[14px] focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/15 transition-colors"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary !h-11 disabled:opacity-60"
      >
        {submitting ? 'Subscribing…' : <>Subscribe <Send size={14} /></>}
      </button>
    </form>
  );
};

const Footer = () => (
  <footer className="bg-white">
    {/* ─── Newsletter strip — sits between page content and the link grid ── */}
    <div className="container-page pt-32 lg:pt-40">
      <div className="border-t border-[#E5E7EB]" />
      <div className="py-14 lg:py-16 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <p className="eyebrow">Newsletter</p>
          <h3 className="mt-4 text-[#111827] font-bold text-[24px] lg:text-[28px] leading-[1.2] font-[family-name:var(--font-heading)] max-w-[20ch]">
            Quarterly packaging insights, straight to your inbox.
          </h3>
        </div>
        <div className="lg:col-span-6 lg:flex lg:justify-end">
          <NewsletterStrip />
        </div>
      </div>
      <div className="border-t border-[#E5E7EB]" />
    </div>

    {/* ─── Link grid ─────────────────────────────────────────────── */}
    <div className="container-page pt-16 lg:pt-20 pb-14 lg:pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-20">

        {/* Brand */}
        <div className="lg:col-span-4">
          <Link to="/" className="inline-block mb-6">
            <Logo size="lg" />
          </Link>
          <p className="text-[15px] leading-[1.8] text-[#6B7280] max-w-sm mb-8">
            Premium industrial packaging for manufacturing, export, and logistics. Bengaluru's trusted packaging partner — rated 4.0 on Google.
          </p>
          <div className="flex gap-2.5">
            {SOCIALS.map(({ kind, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-[#FFF7ED] hover:bg-orange text-orange hover:text-white flex items-center justify-center transition-colors"
              >
                <BrandIcon kind={kind} size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-2">
          <Heading>Products</Heading>
          <ul className="space-y-4">
            {PRODUCT_LINKS.map(({ label, to }) => (
              <li key={to}><FooterLink to={to}>{label}</FooterLink></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="lg:col-span-3">
          <Heading>Company</Heading>
          <ul className="space-y-4">
            {QUICK_LINKS.map(({ label, to }) => (
              <li key={to}><FooterLink to={to}>{label}</FooterLink></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <Heading>Get in Touch</Heading>
          <ul className="space-y-5">
            <li className="flex gap-3 text-[14px] text-[#6B7280] leading-[1.7]">
              <MapPin size={16} className="text-orange mt-1 flex-shrink-0" />
              <span>No. 15, Dhana Lakshmi Layout,<br/>Vidhyaranya Pura, K.G. Shyamarajapura,<br/>Bengaluru — 560097</span>
            </li>
            <li>
              <a href="tel:+919945266092" className="flex gap-3 text-[14px] text-[#6B7280] hover:text-orange transition-colors">
                <Phone size={16} className="text-orange flex-shrink-0 mt-0.5" /> +91 99452 66092
              </a>
            </li>
            <li>
              <a href="mailto:info@ompackagings.in" className="flex gap-3 text-[14px] text-[#6B7280] hover:text-orange transition-colors">
                <Mail size={16} className="text-orange flex-shrink-0 mt-0.5" /> info@ompackagings.in
              </a>
            </li>
            <li className="flex gap-3 text-[14px] text-[#6B7280]">
              <Clock size={16} className="text-orange flex-shrink-0 mt-0.5" />
              Mon – Sat · 9:00 AM – 7:00 PM
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* ─── Certifications row ───────────────────────────────────── */}
    <div className="border-t border-[#E5E7EB]">
      <div className="container-page py-7 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {CERTIFICATIONS.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 justify-center sm:justify-start">
            <Icon size={18} className="text-orange flex-shrink-0" strokeWidth={1.7} />
            <span className="text-[12px] uppercase tracking-[0.12em] font-semibold text-[#111827]">{label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* ─── Bottom legal strip ───────────────────────────────────── */}
    <div className="border-t border-[#E5E7EB] bg-[#FAFAFA]">
      <div className="container-page py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-[#6B7280]">
        <span>© {new Date().getFullYear()} OM Packagings. All rights reserved.</span>
        <span>K.G. Shyamarajapura, Bengaluru, Karnataka</span>
      </div>
    </div>
  </footer>
);

export default Footer;
