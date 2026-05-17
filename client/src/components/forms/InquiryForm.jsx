import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  company: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number').required('Phone is required'),
  productInterest: yup.string(),
  message: yup.string().required('Please describe your requirement'),
  quantity: yup.string(),
});

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-navy mb-1.5 font-[family-name:var(--font-caption)]">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{error}</p>}
  </div>
);

const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)] placeholder:text-[#9CA3AF]';

const InquiryForm = ({ productName = '' }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { productInterest: productName },
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/inquiries', data);
      toast.success('Inquiry submitted! We\'ll get back to you within 24 hours.');
      reset();
    } catch {
      toast.error('Something went wrong. Please try again or call us directly.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name *" error={errors.name?.message}>
          <input {...register('name')} placeholder="John Doe" className={inputClass} />
        </Field>
        <Field label="Company Name" error={errors.company?.message}>
          <input {...register('company')} placeholder="Acme Pvt. Ltd." className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email Address *" error={errors.email?.message}>
          <input {...register('email')} type="email" placeholder="you@company.com" className={inputClass} />
        </Field>
        <Field label="Mobile Number *" error={errors.phone?.message}>
          <input {...register('phone')} placeholder="98765 43210" className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Product / Category of Interest" error={errors.productInterest?.message}>
          <input {...register('productInterest')} placeholder="e.g. Wooden Crates" className={inputClass} />
        </Field>
        <Field label="Estimated Quantity" error={errors.quantity?.message}>
          <input {...register('quantity')} placeholder="e.g. 500 units / month" className={inputClass} />
        </Field>
      </div>

      <Field label="Your Requirement *" error={errors.message?.message}>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="Describe your packaging requirement, dimensions, material preference, delivery location…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange-light text-white font-semibold px-8 py-3.5 rounded-lg transition-colors font-[family-name:var(--font-heading)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send size={16} /> Submit Inquiry
          </>
        )}
      </button>
    </form>
  );
};

export default InquiryForm;
