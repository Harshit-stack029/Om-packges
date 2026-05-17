import { ShieldCheck, Award, Truck, Clock, Leaf } from 'lucide-react';

const ITEMS = [
  { icon: ShieldCheck, label: 'ISO 9001 Certified' },
  { icon: Award,       label: 'ISPM-15 Export Ready' },
  { icon: Truck,       label: 'Pan-India Shipping' },
  { icon: Clock,       label: 'Quote in 24 Hours' },
  { icon: Leaf,        label: 'FSC-Graded Wood' },
];

const CompactTrustStrip = () => (
  <section className="bg-[#FFF7ED]">
    <div className="container-page">
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB]/70 -mx-1">
        {ITEMS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center justify-center gap-3 py-8 px-4">
            <Icon size={20} className="text-orange flex-shrink-0" strokeWidth={1.7} />
            <span className="text-[13px] font-semibold text-[#111827] tracking-[0.02em] font-[family-name:var(--font-heading)] leading-tight">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CompactTrustStrip;
