import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const NewsletterSection = () => {
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
      await api.post('/newsletter', { email, source: 'homepage' });
      setDone(true);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-y bg-[#1B2A4A] relative overflow-hidden">
      {/* Soft orange accent in the corner */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-orange/10 blur-3xl" />

      <div className="container-page relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow text-orange">Stay in the loop</p>
            <h2 className="mt-5 text-white font-bold text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] tracking-[-0.02em] font-[family-name:var(--font-heading)] max-w-[18ch]">
              Quarterly updates on packaging trends &amp; export compliance.
            </h2>
            <p className="mt-7 text-white/65 text-[16px] leading-[1.8] max-w-xl">
              Short, useful, never spammy. Unsubscribe with one click anytime.
            </p>
          </div>

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <CheckCircle2 size={28} className="text-orange flex-shrink-0" strokeWidth={1.6} />
                  <div>
                    <p className="text-white font-semibold text-[16px]">You're subscribed.</p>
                    <p className="text-white/60 text-[13px] mt-1">First update lands at the start of next quarter.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={onSubmit}
                  className="space-y-4"
                  noValidate
                >
                  <label className="relative block">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 h-14 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-[15px] focus:outline-none focus:border-orange focus:bg-white/10 transition-colors"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full !h-14 disabled:opacity-60"
                  >
                    {submitting ? 'Subscribing…' : <>Subscribe <ArrowRight size={16} /></>}
                  </button>
                  <p className="text-[12px] text-white/45 text-center">
                    By subscribing you agree to our privacy practices.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
