import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Send, Upload, X, FileText, CheckCircle2, ShieldCheck, Clock, Truck, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHero from '../components/common/PageHero';
import api from '../services/api';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  company: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile').required('Phone is required'),
  productInterest: yup.string().required('Please select a product category'),
  quantity: yup.string().required('Quantity helps us prepare the right quote'),
  message: yup.string().required('Tell us a bit more about your requirement'),
});

const PRODUCT_OPTIONS = [
  'Wooden Crates & Boxes',
  'Corrugated Boxes',
  'Wooden Pallets',
  'Plywood Boxes',
  'Heat-Treated (ISPM-15) Packaging',
  'Custom Industrial Packaging',
  'Other',
];

// Map a product's category slug onto the closest dropdown option above.
// Falls back to "Custom Industrial Packaging" so the form is always valid.
const matchCategoryToOption = (slug = '') => {
  const s = slug.toLowerCase();
  if (s.includes('wooden')     && s.includes('pallet')) return 'Wooden Pallets';
  if (s.includes('wooden'))                              return 'Wooden Crates & Boxes';
  if (s.includes('corrugated'))                          return 'Corrugated Boxes';
  if (s.includes('plywood'))                             return 'Plywood Boxes';
  if (s.includes('export') || s.includes('ispm'))        return 'Heat-Treated (ISPM-15) Packaging';
  return 'Custom Industrial Packaging';
};

const BENEFITS = [
  { icon: Clock, title: 'Reply in 24 hrs', text: 'Our team gets back within one business day.' },
  { icon: ShieldCheck, title: 'ISO 9001 certified', text: 'Quality you can audit and trust.' },
  { icon: Truck, title: 'PAN-India delivery', text: 'Site delivery across India + export packaging.' },
];

const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)] placeholder:text-[#9CA3AF]';
const labelClass = 'block text-xs font-semibold text-navy mb-1.5 font-[family-name:var(--font-caption)]';

const RequestQuote = () => {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [prefillProduct, setPrefillProduct] = useState(null);
  const [params] = useSearchParams();
  const productSlug = params.get('product');
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  // If user came from a product page (?product=slug), fetch the product and
  // pre-fill the form's productInterest + show a contextual chip above it.
  useEffect(() => {
    if (!productSlug) return;
    api.get(`/products/slug/${productSlug}`)
      .then(({ data }) => {
        const p = data.data || data;
        if (!p) return;
        setPrefillProduct(p);
        setValue('productInterest', matchCategoryToOption(p.category?.slug || ''), { shouldValidate: true });
        setValue(
          'message',
          `I'd like a quote for: ${p.name}${p.category?.name ? ` (${p.category.name})` : ''}.\n\nDimensions / quantity / timeline:\n`,
          { shouldValidate: false }
        );
      })
      .catch(() => {});
  }, [productSlug, setValue]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB.');
      return;
    }
    setFile(f);
  };

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (file) fd.append('attachment', file);
      await api.post('/inquiries', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Quote request submitted!');
      setSubmitted(true);
      reset();
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <>
        <PageHero title="Quote Requested" breadcrumbs={[{ label: 'Request Quote' }]} />
        <section className="max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy font-[family-name:var(--font-heading)] mb-3">Thank you!</h2>
            <p className="text-om-gray font-[family-name:var(--font-caption)] mb-8">
              We've received your quote request and will respond within 24 hours. A confirmation has been sent to your email.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white font-semibold px-6 py-3 rounded-lg transition-colors font-[family-name:var(--font-heading)]"
            >
              Submit Another
            </button>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Request a Quote — OM Packaging</title>
        <meta name="description" content="Get a custom packaging quote from OM Packaging. Free site visit, ISO certified, PAN-India delivery." />
      </Helmet>

      <PageHero
        title="Request a Custom Quote"
        subtitle="Share your requirement — we'll get you a tailored quote within 24 hours."
        breadcrumbs={[{ label: 'Request Quote' }]}
      />

      <section className="section-y bg-white">
        <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Form */}
          <div className="lg:col-span-8 bg-[#FFF7ED] rounded-2xl p-8 lg:p-12">
            {prefillProduct && (
              <div className="mb-7 flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-orange/20">
                <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {prefillProduct.images?.[0]?.url ? (
                    <img src={prefillProduct.images[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={18} className="text-orange" strokeWidth={1.6} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B7280] font-semibold">Inquiring about</p>
                  <p className="text-[14px] font-semibold text-[#111827] truncate">{prefillProduct.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPrefillProduct(null);
                    setValue('productInterest', '');
                    setValue('message', '');
                  }}
                  aria-label="Clear product selection"
                  className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#FFF7ED] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input {...register('name')} placeholder="John Doe" className={inputClass} />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.name.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input {...register('company')} placeholder="Acme Pvt. Ltd." className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input {...register('email')} type="email" placeholder="you@company.com" className={inputClass} />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <input {...register('phone')} placeholder="98765 43210" className={inputClass} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Product Category *</label>
                  <select {...register('productInterest')} className={inputClass}>
                    <option value="">Select a category…</option>
                    {PRODUCT_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.productInterest && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.productInterest.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Estimated Quantity *</label>
                  <input {...register('quantity')} placeholder="e.g. 500 units / month" className={inputClass} />
                  {errors.quantity && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.quantity.message}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Requirement Details *</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Dimensions, material preference, delivery location, timeline…"
                  className={`${inputClass} resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.message.message}</p>}
              </div>

              {/* File upload */}
              <div>
                <label className={labelClass}>Attach Drawing / Reference (optional, max 5 MB)</label>
                <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />
                {file ? (
                  <div className="flex items-center justify-between border border-[#E5E7EB] rounded-lg px-3.5 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-orange flex-shrink-0" />
                      <span className="text-sm text-navy font-medium truncate font-[family-name:var(--font-caption)]">{file.name}</span>
                      <span className="text-xs text-om-gray font-[family-name:var(--font-caption)]">({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button type="button" onClick={() => setFile(null)} className="p-1 rounded hover:bg-light-gray text-om-gray">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#E5E7EB] rounded-lg px-3.5 py-4 hover:border-orange/40 transition-colors flex items-center justify-center gap-2 text-sm text-om-gray font-[family-name:var(--font-caption)]"
                  >
                    <Upload size={16} /> Click to upload (image or PDF)
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange-light text-white font-semibold px-8 py-3.5 rounded-lg transition-colors font-[family-name:var(--font-heading)] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send size={16} /> Request Quote
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Benefits column — open list, no card frames */}
          <aside className="lg:col-span-4 lg:pt-4">
            <p className="eyebrow">Why request a quote?</p>
            <h3 className="h3 text-[#111827] mt-4 mb-10">Direct from the team that builds it.</h3>

            <ul className="space-y-9">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-5">
                  <Icon size={22} className="text-orange flex-shrink-0 mt-0.5" strokeWidth={1.6} />
                  <div>
                    <p className="font-semibold text-[16px] text-[#111827] font-[family-name:var(--font-heading)]">{title}</p>
                    <p className="text-[#6B7280] text-[14px] mt-1.5 leading-[1.7]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-14 pt-10 border-t border-[#E5E7EB]">
              <p className="eyebrow">Need it urgently?</p>
              <p className="text-[#111827] text-[15px] mt-3">Talk to our sales team directly.</p>
              <a
                href="tel:+919876543210"
                className="inline-block text-orange font-bold text-[22px] font-[family-name:var(--font-heading)] hover:underline mt-3"
              >
                +91 98765 43210
              </a>
            </div>
          </aside>
        </div>
        </div>
      </section>
    </>
  );
};

export default RequestQuote;
