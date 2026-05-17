import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Tag, FileText, Image, Award, Mail, Plus,
  ChevronRight, ArrowUpRight, Send, Star, Download,
} from 'lucide-react';
import api from '../../services/api';

/* ─── StatCard — all white, orange icon accent ────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, to, badge }) => (
  <Link
    to={to}
    className="card card-hover group relative block"
  >
    {badge && (
      <span className="absolute top-4 right-4 inline-flex items-center bg-orange text-white text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] border border-orange/20 flex items-center justify-center">
        <Icon size={18} className="text-orange" />
      </div>
      <ArrowUpRight size={14} className="text-[#9CA3AF] group-hover:text-orange transition-colors" />
    </div>
    <p className="text-[28px] font-bold text-[#111827] leading-none">{value ?? '—'}</p>
    <p className="text-[14px] text-[#111827] mt-2 font-medium">{label}</p>
    {sub && <p className="text-[12px] text-[#6B7280] mt-1">{sub}</p>}
  </Link>
);

const QuickAction = ({ icon: Icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center gap-2.5 px-3.5 h-10 rounded-lg border border-[#E5E7EB] hover:border-orange hover:bg-[#FFF7ED] text-[14px] font-medium text-[#111827] transition-colors"
  >
    <Icon size={15} className="text-orange" />
    {label}
  </Link>
);

const StatusDot = ({ status }) => {
  const colors = {
    new:     'bg-orange',
    read:    'bg-[#6B7280]',
    replied: 'bg-[#10B981]',
    closed:  'bg-[#9CA3AF]',
  };
  return <span className={`w-2 h-2 rounded-full inline-block ${colors[status] || 'bg-orange'}`} />;
};

const fmtRelative = (d) => {
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const s = stats;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827] font-[family-name:var(--font-heading)]">Dashboard</h1>
        <p className="text-[14px] text-[#6B7280] mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Primary KPI row — the metrics that move daily */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          icon={Mail} label="Inquiries"
          value={loading ? null : s?.inquiries?.total}
          sub={`${s?.inquiries?.new ?? 0} new`}
          to="/admin/inquiries"
          badge={s?.inquiries?.new > 0 ? `${s.inquiries.new}` : null}
        />
        <StatCard
          icon={Send} label="Subscribers"
          value={loading ? null : s?.subscribers?.active}
          sub={`${s?.subscribers?.total ?? 0} total`}
          to="/admin/subscribers"
        />
        <StatCard
          icon={Star} label="Featured Products"
          value={loading ? null : s?.products?.featured}
          sub={`${s?.products?.active ?? 0} active total`}
          to="/admin/products"
        />
        <StatCard
          icon={Package} label="Products"
          value={loading ? null : s?.products?.total}
          sub={`${s?.categories?.active ?? 0} categories`}
          to="/admin/products"
        />
      </div>

      {/* Secondary content metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Tag}      label="Categories"   value={loading ? null : s?.categories.total}   sub={`${s?.categories.active ?? 0} active`}   to="/admin/categories" />
        <StatCard icon={FileText} label="Blog Posts"   value={loading ? null : s?.blogs.total}        sub={`${s?.blogs.published ?? 0} published`}  to="/admin/blog" />
        <StatCard icon={Image}    label="Gallery"      value={loading ? null : s?.gallery.total}      sub={`${s?.gallery.featured ?? 0} featured`}  to="/admin/gallery" />
        <StatCard icon={Award}    label="Certificates" value={loading ? null : s?.certificates.total} sub={`${s?.certificates.active ?? 0} active`} to="/admin/certificates" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 card !p-0 overflow-hidden self-start">
          <div className="flex items-center justify-between px-5 h-14 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-orange" />
              <h2 className="font-semibold text-[14px] text-[#111827] font-[family-name:var(--font-heading)]">Recent Inquiries</h2>
            </div>
            <Link to="/admin/inquiries" className="text-[12px] text-orange hover:underline font-semibold flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {loading ? (
              <div className="p-8 text-center text-[14px] text-[#6B7280]">Loading…</div>
            ) : !s?.inquiries?.recent?.length ? (
              <div className="p-10 text-center">
                <Mail size={28} className="text-[#D1D5DB] mx-auto mb-2" />
                <p className="text-[14px] text-[#6B7280]">No inquiries yet.</p>
              </div>
            ) : (
              s.inquiries.recent.map((inq) => (
                <Link
                  key={inq._id}
                  to="/admin/inquiries"
                  className="flex items-center gap-3 p-4 hover:bg-[#FFF7ED] transition-colors group"
                >
                  <StatusDot status={inq.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[14px] text-[#111827] truncate">{inq.name}</p>
                      {inq.company && <span className="text-[12px] text-[#6B7280]">· {inq.company}</span>}
                    </div>
                    <p className="text-[12px] text-[#6B7280] truncate mt-0.5">
                      {inq.productInterest || inq.email}
                    </p>
                  </div>
                  <p className="text-[12px] text-[#6B7280] flex-shrink-0">{fmtRelative(inq.createdAt)}</p>
                  <ChevronRight size={14} className="text-[#9CA3AF] group-hover:text-orange transition-colors" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right column: Recent Subscribers + Quick Actions */}
        <div className="space-y-6">

          {/* Recent Subscribers */}
          <div className="card !p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 h-14 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-orange" />
                <h2 className="font-semibold text-[14px] text-[#111827] font-[family-name:var(--font-heading)]">Recent Subscribers</h2>
              </div>
              <Link to="/admin/subscribers" className="text-[12px] text-orange hover:underline font-semibold flex items-center gap-1">
                <Download size={11} /> Export
              </Link>
            </div>

            <div className="divide-y divide-[#E5E7EB]">
              {loading ? (
                <div className="p-8 text-center text-[14px] text-[#6B7280]">Loading…</div>
              ) : !s?.subscribers?.recent?.length ? (
                <div className="p-8 text-center">
                  <Send size={24} className="text-[#D1D5DB] mx-auto mb-2" strokeWidth={1.4} />
                  <p className="text-[13px] text-[#6B7280]">No subscribers yet.</p>
                </div>
              ) : (
                s.subscribers.recent.map((sub) => (
                  <Link
                    key={sub._id}
                    to="/admin/subscribers"
                    className="flex items-center gap-3 p-3.5 hover:bg-[#FFF7ED] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFF7ED] border border-orange/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange font-semibold text-[11px]">
                        {sub.email[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#111827] font-medium truncate">{sub.email}</p>
                      <p className="text-[11px] text-[#6B7280] truncate mt-0.5 capitalize">
                        {sub.source || 'unknown'} · {fmtRelative(sub.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card !p-5">
            <h2 className="font-semibold text-[14px] text-[#111827] font-[family-name:var(--font-heading)] mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2.5">
              <QuickAction icon={Plus} label="Add Product"     to="/admin/products/new" />
              <QuickAction icon={Plus} label="New Category"    to="/admin/categories" />
              <QuickAction icon={Plus} label="New Blog Post"   to="/admin/blog/new" />
              <QuickAction icon={Plus} label="Upload Image"    to="/admin/gallery" />
              <QuickAction icon={Plus} label="Add Certificate" to="/admin/certificates" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
