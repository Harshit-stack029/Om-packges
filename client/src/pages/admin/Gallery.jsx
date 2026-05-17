import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Star, X, Upload, Images } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

/* ─── Upload modal ───────────────────────────────────────────── */
const UploadModal = ({ onClose, onSaved }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '', tag: 'General', isFeatured: false, order: 0 },
  });
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (data) => {
    if (!file) { toast.error('Please select an image.'); return; }
    const fd = new FormData();
    fd.append('image', file);
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    fd.set('isFeatured', data.isFeatured ? 'true' : 'false');
    setSubmitting(true);
    try {
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded.');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)]';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-navy font-[family-name:var(--font-heading)]">Upload Image</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-light-gray text-om-gray"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-[#E5E7EB] rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:border-orange/40 transition-colors overflow-hidden"
            onClick={() => fileRef.current?.click()}
          >
            {preview
              ? <img src={preview} className="w-full h-full object-contain" alt="Preview" />
              : <div className="text-center text-om-gray"><Upload size={32} className="mx-auto mb-2 text-[#D1D5DB]" /><p className="text-sm font-[family-name:var(--font-caption)]">Click to select image</p></div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5 font-[family-name:var(--font-caption)]">Title</label>
              <input {...register('title')} className={inputClass} placeholder="e.g. Wooden crates" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5 font-[family-name:var(--font-caption)]">Tag / Category</label>
              <input {...register('tag')} className={inputClass} placeholder="General" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5 font-[family-name:var(--font-caption)]">Description</label>
            <textarea {...register('description')} rows={2} className={`${inputClass} resize-none`} placeholder="Optional description" />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 accent-orange" />
              <span className="text-sm text-navy font-[family-name:var(--font-caption)]">Featured</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-navy font-[family-name:var(--font-caption)]">Order:</label>
              <input {...register('order')} type="number" className="w-20 px-2 py-1.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 font-[family-name:var(--font-caption)]" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-[#E5E7EB] text-navy text-sm font-semibold font-[family-name:var(--font-caption)]">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 rounded-lg bg-orange hover:bg-orange-light text-white text-sm font-semibold font-[family-name:var(--font-heading)] disabled:opacity-60">
              {submitting ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ─── Main page ──────────────────────────────────────────────── */
const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('all');
  const [tags, setTags] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [galleryRes, tagRes] = await Promise.all([
        api.get(`/gallery?limit=100${activeTag !== 'all' ? `&tag=${activeTag}` : ''}`),
        api.get('/gallery/tags'),
      ]);
      setItems(galleryRes.data.data || []);
      setTags(tagRes.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [activeTag]);

  const deleteItem = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Deleted.');
      load();
    } catch { toast.error('Failed.'); }
  };

  const toggleFeatured = async (item) => {
    try {
      await api.put(`/gallery/${item._id}`, { isFeatured: !item.isFeatured });
      toast.success(item.isFeatured ? 'Removed from featured.' : 'Marked as featured.');
      load();
    } catch { toast.error('Failed.'); }
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-heading)]">Gallery</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors font-[family-name:var(--font-heading)]"
        >
          <Plus size={16} /> Upload Image
        </button>
      </div>

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setActiveTag('all')} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors font-[family-name:var(--font-caption)] ${activeTag === 'all' ? 'bg-navy text-white' : 'bg-white border border-[#E5E7EB] text-om-gray hover:border-navy/30'}`}>All</button>
          {tags.map((tag) => (
            <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors font-[family-name:var(--font-caption)] ${activeTag === tag ? 'bg-orange text-white' : 'bg-white border border-[#E5E7EB] text-om-gray hover:border-orange/30'}`}>{tag}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-xl bg-[#E5E7EB] animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Images size={48} className="text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-om-gray font-[family-name:var(--font-caption)]">No images yet. Upload one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="group relative rounded-xl overflow-hidden bg-[#E5E7EB] aspect-square">
              <img src={item.url} alt={item.title || ''} className="w-full h-full object-cover" />
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-navy/70 px-2 py-1.5">
                  <p className="text-white text-xs font-medium line-clamp-1 font-[family-name:var(--font-caption)]">{item.title}</p>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${item.isFeatured ? 'bg-orange text-white' : 'bg-white/90 text-om-gray hover:bg-orange hover:text-white'}`}
                >
                  <Star size={13} fill={item.isFeatured ? 'white' : 'none'} />
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="w-7 h-7 rounded-full bg-white/90 hover:bg-red-600 hover:text-white text-om-gray flex items-center justify-center transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {item.isFeatured && (
                <div className="absolute top-2 left-2">
                  <span className="bg-orange text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full font-[family-name:var(--font-caption)]">Featured</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSaved={() => { setShowUpload(false); load(); }} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminGallery;
