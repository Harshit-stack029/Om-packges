import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Upload, Award, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

/* ─── Upload / Edit modal ────────────────────────────────────── */
const CertModal = ({ cert, onClose, onSaved }) => {
  const isEdit = Boolean(cert);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(cert?.fileType === 'image' ? cert.fileUrl : null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: cert?.name || '',
      description: cert?.description || '',
      issuedBy: cert?.issuedBy || '',
      issuedDate: cert?.issuedDate ? cert.issuedDate.substring(0, 10) : '',
      expiryDate: cert?.expiryDate ? cert.expiryDate.substring(0, 10) : '',
      isActive: cert?.isActive ?? true,
      order: cert?.order ?? 0,
    },
  });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const onSubmit = async (data) => {
    if (!isEdit && !file) { toast.error('Please select a certificate file.'); return; }
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ''));
    fd.set('isActive', data.isActive ? 'true' : 'false');
    if (file) fd.append('file', file);

    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/certificates/${cert._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Certificate updated.');
      } else {
        await api.post('/certificates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Certificate uploaded.');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)]';
  const labelClass = 'block text-xs font-semibold text-navy mb-1.5 font-[family-name:var(--font-caption)]';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-navy font-[family-name:var(--font-heading)]">{isEdit ? 'Edit Certificate' : 'Upload Certificate'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-light-gray text-om-gray"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* File picker */}
          <div>
            <label className={labelClass}>{isEdit ? 'Replace File (optional)' : 'Certificate File *'}</label>
            <div
              className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-orange/40 transition-colors overflow-hidden"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="max-h-32 object-contain" />
              ) : file ? (
                <div className="text-center text-sm text-om-gray font-[family-name:var(--font-caption)]">
                  <span className="text-2xl">📄</span><p className="mt-1">{file.name}</p>
                </div>
              ) : isEdit && cert?.fileType === 'pdf' ? (
                <div className="text-center"><span className="text-2xl">📄</span><p className="text-xs text-om-gray mt-1 font-[family-name:var(--font-caption)]">Current: PDF file. Click to replace.</p></div>
              ) : isEdit && cert?.fileType === 'image' ? (
                <img src={cert.fileUrl} alt="current" className="max-h-32 object-contain" />
              ) : (
                <div className="text-center"><Upload size={28} className="mx-auto mb-2 text-[#D1D5DB]" /><p className="text-sm text-om-gray font-[family-name:var(--font-caption)]">Click to upload (image or PDF)</p></div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />
          </div>

          <div>
            <label className={labelClass}>Certificate Name *</label>
            <input {...register('name', { required: true })} className={inputClass} placeholder="e.g. ISO 9001:2015" />
          </div>

          <div>
            <label className={labelClass}>Issued By</label>
            <input {...register('issuedBy')} className={inputClass} placeholder="e.g. Bureau Veritas" />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea {...register('description')} rows={2} className={`${inputClass} resize-none`} placeholder="Brief description of this certification" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Issued Date</label>
              <input {...register('issuedDate')} type="date" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Expiry Date</label>
              <input {...register('expiryDate')} type="date" className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="w-4 h-4 accent-orange" />
              <span className="text-sm text-navy font-[family-name:var(--font-caption)]">Active / Visible</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-navy font-[family-name:var(--font-caption)]">Order:</label>
              <input {...register('order')} type="number" className="w-20 px-2 py-1.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 font-[family-name:var(--font-caption)]" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-[#E5E7EB] text-navy text-sm font-semibold font-[family-name:var(--font-caption)]">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 rounded-lg bg-orange hover:bg-orange-light text-white text-sm font-semibold font-[family-name:var(--font-heading)] disabled:opacity-60">
              {submitting ? 'Saving…' : isEdit ? 'Update' : 'Upload'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ─── Main page ──────────────────────────────────────────────── */
const AdminCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/certificates/admin/all')
      .then(({ data }) => setCerts(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (cert) => {
    try {
      const fd = new FormData();
      fd.append('isActive', cert.isActive ? 'false' : 'true');
      fd.append('name', cert.name);
      await api.put(`/certificates/${cert._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(cert.isActive ? 'Hidden from public.' : 'Now visible to public.');
      load();
    } catch { toast.error('Failed.'); }
  };

  const deleteCert = async (id) => {
    if (!confirm('Permanently delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      toast.success('Deleted.');
      load();
    } catch { toast.error('Failed.'); }
  };

  const close = () => setModal(null);
  const onSaved = () => { close(); load(); };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-heading)]">Certificates</h1>
        <button
          onClick={() => setModal({ type: 'upload' })}
          className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors font-[family-name:var(--font-heading)]"
        >
          <Plus size={16} /> Upload Certificate
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-[#E5E7EB]" />
              <div className="p-4 space-y-2"><div className="h-4 bg-[#E5E7EB] rounded w-3/4" /><div className="h-3 bg-[#E5E7EB] rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : certs.length === 0 ? (
        <div className="text-center py-20">
          <Award size={48} className="text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-om-gray font-[family-name:var(--font-caption)]">No certificates yet. Upload one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert) => (
            <div key={cert._id} className={`bg-white rounded-xl border overflow-hidden transition-all ${cert.isActive ? 'border-[#E5E7EB]' : 'border-[#E5E7EB] opacity-60'}`}>
              <div className="aspect-[4/3] bg-light-gray flex items-center justify-center relative overflow-hidden">
                {cert.fileType === 'image'
                  ? <img src={cert.fileUrl} alt={cert.name} className="w-full h-full object-contain p-3" />
                  : <div className="text-center"><span className="text-4xl">📄</span><p className="text-xs text-om-gray mt-1 font-[family-name:var(--font-caption)]">PDF</p></div>
                }
                {!cert.isActive && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <span className="bg-[#E5E7EB] text-om-gray text-xs font-bold uppercase px-2 py-0.5 rounded-full font-[family-name:var(--font-caption)]">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-navy text-sm font-[family-name:var(--font-heading)] mb-0.5">{cert.name}</h3>
                {cert.issuedBy && <p className="text-xs text-om-gray font-[family-name:var(--font-caption)]">By {cert.issuedBy}</p>}
                {cert.expiryDate && (
                  <p className={`text-[10px] mt-1 font-[family-name:var(--font-caption)] ${new Date(cert.expiryDate) < new Date() ? 'text-red-500' : 'text-[#9CA3AF]'}`}>
                    Expires: {new Date(cert.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="text-orange text-xs flex items-center gap-1 font-[family-name:var(--font-caption)] hover:underline">
                    View <ExternalLink size={11} />
                  </a>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => toggleActive(cert)} title={cert.isActive ? 'Hide' : 'Show'} className="p-1.5 rounded-lg hover:bg-light-gray text-om-gray hover:text-navy transition-colors">
                      {cert.isActive ? <Eye size={15} className="text-green-600" /> : <EyeOff size={15} />}
                    </button>
                    <button onClick={() => setModal({ type: 'edit', cert })} className="p-1.5 rounded-lg hover:bg-light-gray text-om-gray hover:text-navy transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteCert(cert._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-om-gray hover:text-red-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal?.type === 'upload' && <CertModal onClose={close} onSaved={onSaved} />}
        {modal?.type === 'edit' && <CertModal cert={modal.cert} onClose={close} onSaved={onSaved} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;
