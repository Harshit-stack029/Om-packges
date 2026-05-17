import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Car, Pill, Cog, ShoppingBag, Plane } from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

const INDUSTRIES = [
  { icon: Cpu,         name: 'Electronics',     anchor: 'electronics' },
  { icon: Car,         name: 'Automotive',      anchor: 'automotive' },
  { icon: Pill,        name: 'Pharma',          anchor: 'pharma' },
  { icon: Cog,         name: 'Heavy Machinery', anchor: 'heavy-machinery' },
  { icon: ShoppingBag, name: 'FMCG',            anchor: 'fmcg' },
  { icon: Plane,       name: 'Export & Logistics', anchor: 'export' },
];

const IndustriesStrip = () => (
  <section className="section-y-sm bg-[#FAFAFA]">
    <div className="container-page">
      <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
        <SectionTitle
          eyebrow="Industries We Serve"
          title="Built for every sector"
        />
        <Link
          to="/industries"
          className="inline-flex items-center gap-2 text-orange font-semibold hover:gap-3 transition-all text-[14px]"
        >
          View all industries <ArrowRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
        <ul className="flex gap-4 lg:gap-5 min-w-min">
          {INDUSTRIES.map(({ icon: Icon, name, anchor }) => (
            <li key={name} className="flex-shrink-0">
              <Link
                to={`/industries#${anchor}`}
                className="group flex flex-col items-center justify-center gap-3 w-[140px] lg:w-[170px] h-[120px] lg:h-[140px] bg-white rounded-xl hover:bg-orange/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFF7ED] group-hover:bg-orange/15 flex items-center justify-center transition-colors">
                  <Icon size={22} className="text-orange" strokeWidth={1.7} />
                </div>
                <span className="text-[13px] font-semibold text-[#111827] group-hover:text-orange transition-colors text-center px-3 font-[family-name:var(--font-heading)]">
                  {name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default IndustriesStrip;
