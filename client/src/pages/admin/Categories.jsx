import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Pencil, Trash2, X, ImageIcon, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';

// ── Validation ────────────────────────────────────────────────────────────────
const schema = yup.object({
  name:        yup.string().required('Name is required').trim(),
  description: yup.string(),
  icon:        yup.string(),
  order:       yup.number().typeError('Must be a number').min(0).default(0),
  isActive:    yup.boolean().default(true),
});

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-medium text-dark-gray mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const inputCls = (hasError) =>
  `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${
    hasError
      ? 'border-red-400 ring-2 ring-red-100'
      : 'border-[#E5E7EB] focus:border-navy focus:ring-2 focus:ring-navy/10'
  }`;

// ── Modal ─────────────────────────────────────────────────────────────────────
const CategoryModal = ({ category, onClose, onSaved }) => {
  const isEdit = Boolean(category);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(category?.coverImage || null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name:        category?.name        || '',
      description: category?.description || '',
      icon:        category?.icon        || '',
      order:       category?.order       ?? 0,
      isActive:    category?.isActive    ?? true,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name',        values.name);
      fd.append('description', values.description || '');
      fd.append('icon',        values.icon        || '');
      fd.append('order',       values.order);
      fd.append('isActive',    values.isActive);
      if (imageFile) fd.append('coverImage', imageFile);

      if (isEdit) {
        await categoryService.update(category._id, fd);
        toast.success('Category updated.');
      } else {
        await categoryService.create(fd);
        toast.success('Category created.');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-navy font-[family-name:var(--font-heading)]">
            {isEdit ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-light-gray transition-colors">
            <X size={18} className="text-om-gray" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Cover image */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-[#E5E7EB] hover:border-orange cursor-pointer flex items-center justify-center bg-light-gray overflow-hidden transition-colors flex-shrink-0"
            >
              {preview
                ? <img src={preview} alt="" className="w-full h-full object-cover" />
                : <ImageIcon size={22} className="text-om-gray" />
              }
            </div>
            <div>
              <p className="text-sm font-medium text-dark-gray">Cover Image</p>
              <p className="text-xs text-om-gray">JPG, PNG · Max 5MB</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1.5 text-xs text-orange hover:underline"
              >
                {preview ? 'Change image' : 'Upload image'}
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <Field label="Category Name *" error={errors.name?.message}>
            <input {...register('name')} placeholder="e.g. Wooden Packaging" className={inputCls(errors.name)} />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <textarea
              {...register('description')}
              placeholder="Short description shown on category card"
              rows={3}
              className={inputCls(errors.description) + ' resize-none'}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Icon (Lucide name)" error={errors.icon?.message}>
              <input {...register('icon')} placeholder="e.g. package" className={inputCls(errors.icon)} />
            </Field>
            <Field label="Display Order" error={errors.order?.message}>
              <input type="number" {...register('order')} className={inputCls(errors.order)} />
            </Field>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" {...register('isActive')} className="w-4 h-4 accent-orange" />
            <span className="text-sm text-dark-gray">Active (visible on website)</span>
          </label>
        </form>

        {/* Modal footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB]">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-dark-gray hover:bg-light-gray rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={submitting}
            className="px-5 py-2 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Delete confirm ─────────────────────────────────────────────────────────────
const DeleteConfirm = ({ category, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await categoryService.delete(category._id);
      toast.success('Category deleted.');
      onDeleted();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
          <Trash2 size={22} className="text-red-600" />
        </div>
        <h2 className="font-bold text-navy font-[family-name:var(--font-heading)] mb-1">Delete Category</h2>
        <p className="text-sm text-om-gray mb-5">
          Delete <strong className="text-dark-gray">{category.name}</strong>? This cannot be undone. Products using this category must be reassigned first.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 text-sm font-medium border border-[#E5E7EB] rounded-lg hover:bg-light-gray transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading} className="flex-1 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60">
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);   // null | { type: 'create' | 'edit' | 'delete', data? }

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll({ active: 'all' });
      setCategories(data.data);
    } catch {
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const closeModal = () => setModal(null);
  const afterSave = () => { closeModal(); fetchCategories(); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-heading)]">Categories</h1>
          <p className="text-om-gray text-sm font-[family-name:var(--font-caption)]">{categories.length} total</p>
        </div>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-dark transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-3 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <Tag size={36} className="mx-auto text-om-gray mb-3" />
            <p className="text-dark-gray font-medium">No categories yet</p>
            <p className="text-om-gray text-sm">Add your first category to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-light-gray border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-dark-gray uppercase tracking-wide">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-dark-gray uppercase tracking-wide hidden md:table-cell">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-dark-gray uppercase tracking-wide hidden sm:table-cell">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-dark-gray uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-light-gray/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {cat.coverImage
                        ? <img src={cat.coverImage} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        : <div className="w-9 h-9 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0">
                            <Tag size={16} className="text-navy/50" />
                          </div>
                      }
                      <div>
                        <p className="font-medium text-navy">{cat.name}</p>
                        {cat.description && <p className="text-xs text-om-gray truncate max-w-[180px]">{cat.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <code className="text-xs bg-light-gray px-2 py-0.5 rounded text-dark-gray">{cat.slug}</code>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell text-dark-gray">{cat.order}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cat.isActive ? 'bg-green-100 text-green-700' : 'bg-[#E5E7EB] text-om-gray'
                    }`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setModal({ type: 'edit', data: cat })}
                        className="p-1.5 rounded-lg text-om-gray hover:text-navy hover:bg-light-gray transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setModal({ type: 'delete', data: cat })}
                        className="p-1.5 rounded-lg text-om-gray hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
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

      {/* Modals */}
      {modal?.type === 'create' && (
        <CategoryModal onClose={closeModal} onSaved={afterSave} />
      )}
      {modal?.type === 'edit' && (
        <CategoryModal category={modal.data} onClose={closeModal} onSaved={afterSave} />
      )}
      {modal?.type === 'delete' && (
        <DeleteConfirm category={modal.data} onClose={closeModal} onDeleted={afterSave} />
      )}
    </div>
  );
};

export default AdminCategories;
