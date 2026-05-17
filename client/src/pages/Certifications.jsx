import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Award } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import CTABanner from '../components/common/CTABanner';
import api from '../services/api';
import certificationsHero from '../assets/certifications-hero.webp';

const CertCard = ({ cert, index }) => {
  const isPdf = cert.fileType === 'pdf';
  const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();

  return (
    <motion.div
      className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-orange/30 hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      {/* Preview */}
      <div className="aspect-[4/3] bg-light-gray relative flex items-center justify-center overflow-hidden">
        {isPdf ? (
          <div className="flex flex-col items-center gap-2 text-center p-4">
            <FileText size={48} className="text-orange/60" />
            <span className="text-xs text-om-gray font-[family-name:var(--font-caption)]">PDF Document</span>
          </div>
        ) : (
          <img
            src={cert.fileUrl}
            alt={cert.name}
            className="w-full h-full object-contain p-4"
          />
        )}
        {isExpired && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full font-[family-name:var(--font-caption)]">
              Expired
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="font-bold text-navy text-sm font-[family-name:var(--font-heading)] mb-1">{cert.name}</h3>
        {cert.issuedBy && (
          <p className="text-xs text-om-gray font-[family-name:var(--font-caption)] mb-1">Issued by: {cert.issuedBy}</p>
        )}
        {cert.description && (
          <p className="text-xs text-om-gray leading-relaxed font-[family-name:var(--font-caption)] line-clamp-2 mb-3">{cert.description}</p>
        )}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {cert.issuedDate && (
            <span className="text-[10px] text-[#9CA3AF] font-[family-name:var(--font-caption)]">
              {new Date(cert.issuedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              {cert.expiryDate && ` – ${new Date(cert.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`}
            </span>
          )}
          <a
            href={cert.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-orange text-xs font-semibold hover:underline font-[family-name:var(--font-caption)]"
            onClick={(e) => e.stopPropagation()}
          >
            View <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const CertSkeleton = () => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-[#E5E7EB]" />
    <div className="p-5 space-y-2">
      <div className="h-4 w-3/4 bg-[#E5E7EB] rounded" />
      <div className="h-3 w-1/2 bg-[#E5E7EB] rounded" />
      <div className="h-3 w-full bg-[#E5E7EB] rounded" />
    </div>
  </div>
);

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates')
      .then(({ data }) => setCerts(data.data || []))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Certifications — OM Packaging</title>
        <meta name="description" content="OM Packaging holds ISO and industry certifications ensuring the highest quality in industrial packaging solutions." />
      </Helmet>

      <PageHero
        title="Our Certifications"
        subtitle="Our certifications reflect our commitment to quality, safety, and compliance across every product we deliver."
        breadcrumbs={[{ label: 'Certifications' }]}
        image={certificationsHero}
      />

      {/* Intro blurb */}
      <section className="section-y bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-2">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF7ED] flex items-center justify-center">
                <Award size={32} className="text-orange" strokeWidth={1.6} />
              </div>
            </div>
            <div className="lg:col-span-10">
              <p className="text-[#6B7280] text-[18px] leading-[1.85] prose-readable-xl">
                OM Packaging maintains internationally recognised certifications to guarantee the quality, safety, and reliability
                of every packaging solution. Our ISPM-15 certified heat treatment facility allows us to serve export clients in
                over 180 countries without compliance barriers.
              </p>
            </div>
          </div>

          <div className="stack-section">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-14">
                {Array.from({ length: 4 }).map((_, i) => <CertSkeleton key={i} />)}
              </div>
            ) : certs.length === 0 ? (
              <div className="text-center py-20">
                <Award size={48} className="text-[#D1D5DB] mx-auto mb-4" />
                <p className="text-om-gray font-[family-name:var(--font-caption)]">Certifications coming soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-14">
                {certs.map((cert, i) => <CertCard key={cert._id} cert={cert} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
};

export default Certifications;
