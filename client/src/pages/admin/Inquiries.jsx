import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Mail, Phone, Building2, Calendar, FileText,
  X, Trash2, MessageSquare, ChevronRight, Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const STATUS_OPTIONS = [
  { key: 'all',     label: 'All',     color: 'bg-[#111827] text-white' },
  { key: 'new',     label: 'New',     color: 'bg-orange text-white' },
  { key: 'read',    label: 'Read',    color: 'bg-white border border-[#E5E7EB] text-[#111827]' },
  { key: 'replied', label: 'Replied', color: 'bg-[#FFF7ED] border border-orange/30 text-orange' },
  { key: 'closed',  label: 'Closed',  color: 'bg-[#F3F4F6] border border-[#E5E7EB] text-[#6B7280]' },
];

const StatusBadge = ({ status }) => {
  const colors = {
    new: 'bg-orange/10 text-orange border-orange/20',
    read: 'bg-[#F9FAFB] text-[#111827] border-[#E5E7EB]',
    replied: 'bg-[#FFF7ED] text-orange border-orange/20',
    closed: 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border font-[family-name:var(--font-caption)] ${colors[status] || colors.new}`}>
      {status}
    </span>
  );
};

const fmtDate = (d) => new Date(d).toLocaleString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

/* ─── Detail drawer ─────────────────────────────────────────── */
const InquiryDrawer = ({ inquiry, onClose, onUpdated }) => {
  const [data, setData] = useState(inquiry);
  const [adminNote, setAdminNote] = useState(inquiry.adminNote || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Auto-mark as read when opened
    if (inquiry.status === 'new') {
      api.get(`/inquiries/${inquiry._id}`)
        .then(({ data: res }) => { setData(res.data); onUpdated(); })
        .catch(() => {});
    }
  }, [inquiry._id]);

  const setStatus = async (status) => {
    setSaving(true);
    try {
      const { data: res } = await api.patch(`/inquiries/${data._id}/status`, { status, adminNote });
      setData(res.data);
      toast.success(`Marked as ${status}.`);
      onUpdated();
    } catch { toast.error('Failed to update.'); }
    finally { setSaving(false); }
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      const { data: res } = await api.patch(`/inquiries/${data._id}/status`, { status: data.status, adminNote });
      setData(res.data);
      toast.success('Note saved.');
      onUpdated();
    } catch { toast.error('Failed.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0">
            <StatusBadge status={data.status} />
            <span className="text-xs text-om-gray font-[family-name:var(--font-caption)] truncate">
              {fmtDate(data.createdAt)}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-light-gray text-om-gray">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-navy font-[family-name:var(--font-heading)] mb-1">{data.name}</h2>
            {data.company && (
              <p className="flex items-center gap-1.5 text-sm text-om-gray font-[family-name:var(--font-caption)]">
                <Building2 size={13} /> {data.company}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm bg-light-gray rounded-xl p-4">
            <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-navy font-medium font-[family-name:var(--font-caption)] hover:text-orange transition-colors">
              <Mail size={14} className="text-orange" /> {data.email}
            </a>
            <a href={`tel:${data.phone}`} className="flex items-center gap-2 text-navy font-medium font-[family-name:var(--font-caption)] hover:text-orange transition-colors">
              <Phone size={14} className="text-orange" /> {data.phone}
            </a>
            <a
              href={`https://wa.me/91${data.phone.replace(/\D/g, '').slice(-10)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-orange font-medium font-[family-name:var(--font-caption)] hover:underline mt-1"
            >
              <MessageSquare size={14} /> Send WhatsApp
            </a>
          </div>

          {/* Product / quantity */}
          {(data.productInterest || data.quantity) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-om-gray font-[family-name:var(--font-caption)] mb-0.5">Product</p>
                <p className="text-sm text-navy font-medium font-[family-name:var(--font-caption)]">{data.productInterest || '—'}</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-om-gray font-[family-name:var(--font-caption)] mb-0.5">Quantity</p>
                <p className="text-sm text-navy font-medium font-[family-name:var(--font-caption)]">{data.quantity || '—'}</p>
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 font-[family-name:var(--font-caption)]">Message</p>
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
              <p className="text-sm text-navy whitespace-pre-wrap leading-relaxed font-[family-name:var(--font-caption)]">{data.message}</p>
            </div>
          </div>

          {/* Source */}
          {data.sourceUrl && (
            <div className="text-xs text-om-gray font-[family-name:var(--font-caption)] flex items-center gap-1.5">
              <FileText size={12} /> Submitted from <span className="text-navy font-medium truncate">{data.sourceUrl}</span>
            </div>
          )}

          {/* Status actions */}
          <div>
            <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 font-[family-name:var(--font-caption)]">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {['new', 'read', 'replied', 'closed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  disabled={saving || data.status === s}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors font-[family-name:var(--font-caption)] capitalize ${
                    data.status === s
                      ? 'bg-navy text-white cursor-default'
                      : 'bg-white border border-[#E5E7EB] text-navy hover:border-orange hover:text-orange disabled:opacity-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-2 font-[family-name:var(--font-caption)]">Internal Note</p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder="Add an internal note (e.g. quoted Rs 25k, awaiting confirmation)…"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none font-[family-name:var(--font-caption)]"
            />
            <button
              onClick={saveNote}
              disabled={saving || adminNote === (data.adminNote || '')}
              className="mt-2 px-4 py-1.5 bg-orange hover:bg-orange-light text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
            >
              Save Note
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
};

/* ─── Main page ──────────────────────────────────────────────── */
const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [active, setActive] = useState(null);

  const load = () => {
    setLoading(true);
    api.get(`/inquiries?status=${status}&search=${search}&page=${page}&limit=20`)
      .then(({ data }) => {
        setInquiries(data.data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status, search, page]);

  const deleteInquiry = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Permanently delete this inquiry?')) return;
    try {
      await api.delete(`/inquiries/${id}`);
      toast.success('Deleted.');
      load();
      if (active?._id === id) setActive(null);
    } catch { toast.error('Failed.'); }
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-heading)]">Inquiries</h1>
          <p className="text-om-gray text-sm font-[family-name:var(--font-caption)] mt-0.5">Customer inquiries from contact form and quote requests.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, company…"
            className="w-full pl-9 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)] placeholder:text-[#9CA3AF]"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => { setStatus(s.key); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors font-[family-name:var(--font-caption)] ${
                status === s.key ? s.color : 'bg-white border border-[#E5E7EB] text-om-gray hover:border-orange/30 hover:text-navy'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-om-gray font-[family-name:var(--font-caption)]">Loading…</div>
        ) : inquiries.length === 0 ? (
          <div className="p-16 text-center">
            <Mail size={40} className="text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-om-gray font-[family-name:var(--font-caption)]">No inquiries found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {inquiries.map((inq) => (
              <button
                key={inq._id}
                onClick={() => setActive(inq)}
                className={`w-full text-left p-4 hover:bg-[#FAFAFA] transition-colors flex items-start gap-3 group ${
                  inq.status === 'new' ? 'bg-orange/[0.02]' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${inq.status === 'new' ? 'bg-orange' : 'bg-[#E5E7EB]'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-navy text-sm font-[family-name:var(--font-caption)]">{inq.name}</span>
                    {inq.company && <span className="text-xs text-om-gray font-[family-name:var(--font-caption)]">· {inq.company}</span>}
                    <StatusBadge status={inq.status} />
                  </div>
                  <p className="text-sm text-navy/80 line-clamp-1 font-[family-name:var(--font-caption)]">
                    {inq.productInterest ? <span className="font-medium text-orange">{inq.productInterest}: </span> : ''}{inq.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-om-gray font-[family-name:var(--font-caption)] flex-wrap">
                    <span className="flex items-center gap-1"><Mail size={11} /> {inq.email}</span>
                    <span className="flex items-center gap-1"><Phone size={11} /> {inq.phone}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {fmtDate(inq.createdAt)}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => deleteInquiry(inq._id, e)}
                  className="p-1.5 rounded-lg text-om-gray hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
                <ChevronRight size={16} className="text-[#9CA3AF] mt-1 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm rounded-lg border border-[#E5E7EB] text-navy font-medium disabled:opacity-40 font-[family-name:var(--font-caption)]"
          >
            Previous
          </button>
          <span className="text-sm text-om-gray font-[family-name:var(--font-caption)]">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm rounded-lg border border-[#E5E7EB] text-navy font-medium disabled:opacity-40 font-[family-name:var(--font-caption)]"
          >
            Next
          </button>
        </div>
      )}

      <AnimatePresence>
        {active && (
          <InquiryDrawer
            inquiry={active}
            onClose={() => setActive(null)}
            onUpdated={load}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminInquiries;
