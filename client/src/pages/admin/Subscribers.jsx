import { useEffect, useState } from 'react';
import { Search, Download, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const fmtDate = (d) => new Date(d).toLocaleString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const Subscribers = () => {
  const [subs, setSubs] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/newsletter', { params: { search, limit: 200 } });
      setSubs(data.data || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load subscribers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, search ? 250 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/newsletter/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded.');
    } catch {
      toast.error('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscriber? They will no longer receive newsletters.')) return;
    try {
      await api.delete(`/newsletter/${id}`);
      setSubs((cur) => cur.filter((s) => s._id !== id));
      setTotal((t) => Math.max(0, t - 1));
      toast.success('Removed.');
    } catch {
      toast.error('Delete failed.');
    }
  };

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-[#111827] font-[family-name:var(--font-heading)]">
            Newsletter Subscribers
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-1">{total} active subscriber{total === 1 ? '' : 's'}</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || total === 0}
          className="btn btn-primary btn-sm disabled:opacity-60"
        >
          <Download size={14} /> {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email…"
          className="field pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6B7280] text-[14px]">Loading…</div>
        ) : subs.length === 0 ? (
          <div className="p-16 text-center">
            <Mail size={36} className="text-[#D1D5DB] mx-auto mb-4" />
            <p className="text-[#6B7280] text-[14px]">
              {search ? 'No matches.' : 'No subscribers yet.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.1em]">Email</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.1em]">Source</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.1em]">Subscribed</th>
                <th className="px-5 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {subs.map((s) => (
                <tr key={s._id} className="hover:bg-[#FFF7ED]/40 transition-colors">
                  <td className="px-5 py-4">
                    <a href={`mailto:${s.email}`} className="text-[14px] text-[#111827] font-medium hover:text-orange transition-colors">
                      {s.email}
                    </a>
                    {!s.isActive && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-[#6B7280]">inactive</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#6B7280] capitalize">{s.source || '—'}</td>
                  <td className="px-5 py-4 text-[13px] text-[#6B7280]">{fmtDate(s.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-1.5 rounded-md text-[#9CA3AF] hover:text-red hover:bg-[#FEF2F2] transition-colors"
                      aria-label="Delete subscriber"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subscribers;
