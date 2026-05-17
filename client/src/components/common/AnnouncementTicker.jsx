import { ShieldCheck, Truck, Award, Phone } from 'lucide-react';

const ITEMS = [
  { icon: ShieldCheck, label: 'ISO 9001 Certified' },
  { icon: Truck,       label: 'Pan-India Shipping' },
  { icon: Award,       label: '15+ Years Experience' },
  { icon: Phone,       label: 'Quote in 24 Hours', href: 'tel:+919945266092' },
];

const Item = ({ icon: Icon, label, href }) => {
  const inner = (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[12px] tracking-wide">
      <Icon size={13} className="text-orange flex-shrink-0" strokeWidth={2} />
      <span className="text-white/90 font-medium">{label}</span>
    </span>
  );
  return href ? <a href={href} className="hover:text-white">{inner}</a> : inner;
};

const AnnouncementTicker = () => (
  <div className="bg-[#1B2A4A] text-white">
    {/* Desktop: evenly distributed row */}
    <div className="container-page hidden md:flex items-center justify-between h-9">
      {ITEMS.map((item) => <Item key={item.label} {...item} />)}
    </div>

    {/* Mobile: marquee scroll so all USPs are seen */}
    <div className="md:hidden overflow-hidden h-9 flex items-center">
      <div className="flex animate-marquee gap-12 pl-6">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <Item key={`${item.label}-${i}`} {...item} />
        ))}
      </div>
    </div>
  </div>
);

export default AnnouncementTicker;
