import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

/* ─── Validation ─────────────────────────────────────────────── */
const schema = yup.object({
  title: yup.string().required('Title is required'),
  excerpt: yup.string().max(300, 'Max 300 characters'),
  content: yup.string().required('Content is required'),
  author: yup.string(),
  tags: yup.string(),
  isPublished: yup.boolean(),
});

const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)]';
const labelClass = 'block text-xs font-semibold text-navy mb-1.5 font-[family-name:var(--font-caption)]';

/* ─── Modal ──────────────────────────────────────────────────── */
const BlogModal = ({ mode, post, onClose, onSaved }) => {
  const isEdit = mode === 'edit';
  const [coverPreview, setCoverPreview] = useState(post?.coverImage || null);
  const [coverFile, setCoverFile] = useState(null);
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      author: post?.author || 'OM Packaging Team',
      tags: post?.tags?.join(', ') || '',
      isPublished: post?.isPublished ?? false,
    },
  });

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ''));
    const tagArr = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
    fd.set('tags', JSON.stringify(tagArr));
    fd.set('isPublished', data.isPublished ? 'true' : 'false');
    if (coverFile) fd.append('coverImage', coverFile);

    try {
      if (isEdit) {
        await api.put(`/blog/${post._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Post updated.');
      } else {
        await api.post('/blog', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Post created.');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-navy font-[family-name:var(--font-heading)]">
            {isEdit ? 'Edit Post' : 'New Blog Post'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-light-gray text-om-gray"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Cover image */}
          <div>
            <label className={labelClass}>Cover Image</label>
            <div
              className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-orange/40 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full max-h-48 object-cover rounded-lg" />
              ) : (
                <>
                  <FileText size={32} className="text-[#D1D5DB]" />
                  <span className="text-sm text-om-gray font-[family-name:var(--font-caption)]">Click to upload cover image</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          <div>
            <label className={labelClass}>Title *</label>
            <input {...register('title')} className={inputClass} placeholder="Post title" />
            {errors.title && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Excerpt (max 300 chars)</label>
            <textarea {...register('excerpt')} rows={2} className={`${inputClass} resize-none`} placeholder="Short summary shown in listing…" />
            {errors.excerpt && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.excerpt.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Content * (HTML supported)</label>
            <textarea {...register('content')} rows={12} className={`${inputClass} resize-y font-mono text-xs`} placeholder="<p>Write your content here…</p>" />
            {errors.content && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Author</label>
              <input {...register('author')} className={inputClass} placeholder="Author name" />
            </div>
            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input {...register('tags')} className={inputClass} placeholder="Wooden, Export, Tips" />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('isPublished')} className="w-4 h-4 accent-orange" />
            <span className="text-sm font-medium text-navy font-[family-name:var(--font-caption)]">Publish immediately</span>
          </label>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-[#E5E7EB] text-navy text-sm font-semibold hover:bg-light-gray transition-colors font-[family-name:var(--font-caption)]">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-orange hover:bg-orange-light text-white text-sm font-semibold transition-colors font-[family-name:var(--font-heading)] disabled:opacity-60">
              {isSubmitting ? 'Saving…' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ─── Delete confirm ─────────────────────────────────────────── */
const DeleteModal = ({ post, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const confirm = async () => {
    setLoading(true);
    try {
      await api.delete(`/blog/${post._id}`);
      toast.success('Post deleted.');
      onDeleted();
    } catch {
      toast.error('Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <h3 className="font-bold text-navy font-[family-name:var(--font-heading)] mb-2">Delete Post?</h3>
        <p className="text-om-gray text-sm font-[family-name:var(--font-caption)] mb-6">
          "<strong>{post.title}</strong>" will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[#E5E7EB] text-navy text-sm font-semibold font-[family-name:var(--font-caption)]">Cancel</button>
          <button onClick={confirm} disabled={loading} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold font-[family-name:var(--font-caption)] disabled:opacity-60">
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main page ──────────────────────────────────────────────── */
const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    api.get(`/blog/admin/all?search=${search}`)
      .then(({ data }) => setPosts(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const togglePublish = async (post) => {
    try {
      await api.put(`/blog/${post._id}`, JSON.stringify({ isPublished: !post.isPublished, title: post.title, content: post.content }), {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(post.isPublished ? 'Post unpublished.' : 'Post published.');
      load();
    } catch {
      toast.error('Failed to update.');
    }
  };

  const closeModal = () => setModal(null);
  const onSaved = () => { closeModal(); load(); };

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-heading)]">Blog Posts</h1>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors font-[family-name:var(--font-heading)]"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts…"
          className="w-full pl-9 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)] placeholder:text-[#9CA3AF]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-om-gray font-[family-name:var(--font-caption)]">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={40} className="text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-om-gray font-[family-name:var(--font-caption)]">No posts yet. Create one to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy uppercase tracking-wider font-[family-name:var(--font-caption)]">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy uppercase tracking-wider font-[family-name:var(--font-caption)] hidden sm:table-cell">Author</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy uppercase tracking-wider font-[family-name:var(--font-caption)] hidden md:table-cell">Tags</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-navy uppercase tracking-wider font-[family-name:var(--font-caption)]">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {post.coverImage
                        ? <img src={post.coverImage} alt="" className="w-10 h-7 object-cover rounded flex-shrink-0" />
                        : <div className="w-10 h-7 bg-light-gray rounded flex-shrink-0 flex items-center justify-center"><FileText size={14} className="text-[#D1D5DB]" /></div>
                      }
                      <span className="font-medium text-navy font-[family-name:var(--font-caption)] line-clamp-1">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-om-gray font-[family-name:var(--font-caption)] hidden sm:table-cell">{post.author}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {post.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="bg-orange/10 text-orange text-[10px] font-semibold px-2 py-0.5 rounded-full font-[family-name:var(--font-caption)]">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button onClick={() => togglePublish(post)} title={post.isPublished ? 'Unpublish' : 'Publish'}>
                      {post.isPublished
                        ? <Eye size={16} className="text-green-600 mx-auto" />
                        : <EyeOff size={16} className="text-[#9CA3AF] mx-auto" />
                      }
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal({ type: 'edit', post })} className="p-1.5 rounded-lg hover:bg-light-gray text-om-gray hover:text-navy transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setModal({ type: 'delete', post })} className="p-1.5 rounded-lg hover:bg-red-50 text-om-gray hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {modal?.type === 'create' && <BlogModal mode="create" onClose={closeModal} onSaved={onSaved} />}
        {modal?.type === 'edit' && <BlogModal mode="edit" post={modal.post} onClose={closeModal} onSaved={onSaved} />}
        {modal?.type === 'delete' && <DeleteModal post={modal.post} onClose={closeModal} onDeleted={onSaved} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlog;
