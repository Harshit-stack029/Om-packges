import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Plus, Pencil, Trash2, X, Package, Search,
  ChevronLeft, ChevronRight, Star, Eye, EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ImageUploader from '../../components/admin/ImageUploader';

// ── Form schema ───────────────────────────────────────────────────────────────
const schema = yup.object({
  name:             yup.string().required('Product name is required').trim(),
  categoryId:       yup.string().required('Category is required'),
  shortDescription: yup.string(),
  description:      yup.string(),
  isActive:         yup.boolean().default(true),
  isFeatured:       yup.boolean().default(false),
  specifications:   yup.array().of(yup.object({ key: yup.string().required('Key required'), value: yup.string().required('Value required') })),
  features:         yup.array().of(yup.string().required()),
  applications:     yup.array().of(yup.string().required()),
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = (hasError) =>
  `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${
    hasError ? 'border-red-400 ring-2 ring-red-100' : 'border-[#E5E7EB] focus:border-navy focus:ring-2 focus:ring-navy/10'
  }`;

const Field = ({ label, error, children, required }) => (
  <div>
    <label className="block text-xs font-medium text-dark-gray mb-1">
      {label}{required && ' *'}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = ['Basic Info', 'Images', 'Specifications', 'Features'];

const StepBar = ({ current }) => (
  <div className="flex items-center gap-0 mb-6">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={label} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              done ? 'bg-green-500 text-white' : active ? 'bg-navy text-white' : 'bg-[#E5E7EB] text-om-gray'
            }`}>
              {done ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${active ? 'text-navy' : 'text-om-gray'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 ${done ? 'bg-green-400' : 'bg-[#E5E7EB]'}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ── Dynamic list editor (features / applications) ─────────────────────────────
const StringListEditor = ({ label, placeholder, register, fields, append, remove }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-medium text-dark-gray">{label}</label>
      <button type="button" onClick={() => append('')} className="text-xs text-orange hover:underline flex items-center gap-1">
        <Plus size={12} /> Add
      </button>
    </div>
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div key={field.id} className="flex gap-2">
          <input {...register(`${label === 'Features' ? 'features' : 'applications'}.${i}`)} placeholder={placeholder} className={inputCls(false) + ' flex-1'} />
          <button type="button" onClick={() => remove(i)} className="p-2 text-om-gray hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}
      {fields.length === 0 && (
        <p className="text-xs text-om-gray italic">No {label.toLowerCase()} added.</p>
      )}
    </div>
  </div>
);

// ── Product Form Modal ────────────────────────────────────────────────────────
const ProductModal = ({ product, categories, onClose, onSaved }) => {
  const isEdit = Boolean(product);
  const [step, setStep] = useState(0);

  // Image state
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [removedPublicIds, setRemovedPublicIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, control, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name:             product?.name             || '',
      categoryId:       product?.category?._id    || product?.category || '',
      shortDescription: product?.shortDescription || '',
      description:      product?.description      || '',
      isActive:         product?.isActive         ?? true,
      isFeatured:       product?.isFeatured        ?? false,
      specifications:   product?.specifications   || [],
      features:         product?.features         || [],
      applications:     product?.applications     || [],
    },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({ control, name: 'specifications' });
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: 'features' });
  const { fields: appFields, append: appendApp, remove: removeApp } = useFieldArray({ control, name: 'applications' });

  const handleFilesAdd = (files) => {
    const totalAllowed = 8 - existingImages.length - newFiles.length;
    const toAdd = files.slice(0, totalAllowed).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewFiles((prev) => [...prev, ...toAdd]);
  };

  const handleExistingRemove = (publicId) => {
    setRemovedPublicIds((prev) => [...prev, publicId]);
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const handleNewRemove = (index) => {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const nextStep = async () => {
    const stepFields = [
      ['name', 'categoryId'],
      [],
      [],
      [],
    ];
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name',             values.name);
      fd.append('categoryId',       values.categoryId);
      fd.append('shortDescription', values.shortDescription || '');
      fd.append('description',      values.description      || '');
      fd.append('isActive',         values.isActive);
      fd.append('isFeatured',       values.isFeatured);
      fd.append('specifications',   JSON.stringify(values.specifications));
      fd.append('features',         JSON.stringify(values.features));
      fd.append('applications',     JSON.stringify(values.applications));

      if (isEdit) {
        fd.append('imagesToRemove', JSON.stringify(removedPublicIds));
      }
      newFiles.forEach((item) => fd.append('images', item.file));

      if (isEdit) {
        await productService.update(product._id, fd);
        toast.success('Product updated.');
      } else {
        await productService.create(fd);
        toast.success('Product created.');
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-navy font-[family-name:var(--font-heading)]">
            {isEdit ? `Edit: ${product.name}` : 'New Product'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-light-gray transition-colors">
            <X size={18} className="text-om-gray" />
          </button>
        </div>

        {/* Step body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <StepBar current={step} />

          {/* Step 1 — Basic Info */}
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Product Name" required error={errors.name?.message}>
                <input {...register('name')} placeholder="e.g. Export Grade Plywood Box" className={inputCls(errors.name)} />
              </Field>
              <Field label="Category" required error={errors.categoryId?.message}>
                <select {...register('categoryId')} className={inputCls(errors.categoryId)}>
                  <option value="">Select a category…</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Short Description" error={errors.shortDescription?.message}>
                <input {...register('shortDescription')} placeholder="One-line summary shown on product cards" className={inputCls(errors.shortDescription)} />
              </Field>
              <Field label="Full Description" error={errors.description?.message}>
                <textarea {...register('description')} placeholder="Detailed product description…" rows={4} className={inputCls(errors.description) + ' resize-none'} />
              </Field>
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" {...register('isActive')} className="w-4 h-4 accent-orange" />
                  <span className="text-sm text-dark-gray">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 accent-orange" />
                  <span className="text-sm text-dark-gray">Featured</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2 — Images */}
          {step === 1 && (
            <ImageUploader
              existing={existingImages}
              newFiles={newFiles}
              onExistingRemove={handleExistingRemove}
              onNewRemove={handleNewRemove}
              onFilesAdd={handleFilesAdd}
              maxImages={8}
            />
          )}

          {/* Step 3 — Specifications */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-dark-gray">Specification Table (Key / Value pairs)</p>
                <button
                  type="button"
                  onClick={() => appendSpec({ key: '', value: '' })}
                  className="text-xs text-orange hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add Row
                </button>
              </div>
              {specFields.length === 0 && (
                <p className="text-xs text-om-gray italic">No specifications added.</p>
              )}
              <div className="space-y-2">
                {specFields.map((field, i) => (
                  <div key={field.id} className="flex gap-2">
                    <input {...register(`specifications.${i}.key`)} placeholder="e.g. Material" className={inputCls(errors.specifications?.[i]?.key) + ' flex-1'} />
                    <input {...register(`specifications.${i}.value`)} placeholder="e.g. Hardwood Plywood" className={inputCls(errors.specifications?.[i]?.value) + ' flex-1'} />
                    <button type="button" onClick={() => removeSpec(i)} className="p-2 text-om-gray hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Features & Applications */}
          {step === 3 && (
            <div className="space-y-6">
              <StringListEditor
                label="Features"
                placeholder="e.g. ISPM-15 heat treated"
                register={register}
                fields={featureFields}
                append={appendFeature}
                remove={removeFeature}
              />
              <StringListEditor
                label="Applications"
                placeholder="e.g. Automotive parts export"
                register={register}
                fields={appFields}
                append={appendApp}
                remove={removeApp}
              />
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => step === 0 ? onClose() : setStep((s) => s - 1)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-dark-gray hover:bg-light-gray rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={nextStep} className="flex items-center gap-1.5 px-5 py-2 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-dark transition-colors">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-light transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Delete confirm ─────────────────────────────────────────────────────────────
const DeleteConfirm = ({ product, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await productService.delete(product._id);
      toast.success('Product deleted.');
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
        <h2 className="font-bold text-navy font-[family-name:var(--font-heading)] mb-1">Delete Product</h2>
        <p className="text-sm text-om-gray mb-5">
          Delete <strong className="text-dark-gray">{product.name}</strong>? All images will be permanently removed from Cloudinary.
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
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const searchTimer = useRef(null);

  const fetchProducts = useCallback(async (q = '') => {
    try {
      const { data } = await productService.getAllAdmin({ search: q });
      setProducts(data.data);
    } catch {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    categoryService.getAll({ active: 'all' })
      .then(({ data }) => setCategories(data.data))
      .catch(() => {});
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchProducts(q), 350);
  };

  const handleToggle = async (product, field) => {
    try {
      const { data } = await productService.toggle(product._id, field);
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, [field]: data.data[field] } : p))
      );
    } catch {
      toast.error('Toggle failed.');
    }
  };

  const closeModal = () => setModal(null);
  const afterSave = () => { closeModal(); fetchProducts(search); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-heading)]">Products</h1>
          <p className="text-om-gray text-sm font-[family-name:var(--font-caption)]">{products.length} total</p>
        </div>
        <div className="flex gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-56 sm:flex-none">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search products…"
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#E5E7EB] text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            />
          </div>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="flex items-center gap-2 px-4 py-2 bg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-dark transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-3 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package size={36} className="mx-auto text-om-gray mb-3" />
            <p className="text-dark-gray font-medium">{search ? 'No products match your search' : 'No products yet'}</p>
            <p className="text-om-gray text-sm">
              {search ? 'Try a different search term.' : 'Add your first product to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-light-gray border-b border-[#E5E7EB]">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-dark-gray uppercase tracking-wide">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-dark-gray uppercase tracking-wide">Category</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-dark-gray uppercase tracking-wide">Featured</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-dark-gray uppercase tracking-wide">Active</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-light-gray/50 transition-colors">
                    {/* Product */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url
                          ? <img src={product.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          : <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0">
                              <Package size={18} className="text-navy/40" />
                            </div>
                        }
                        <div>
                          <p className="font-medium text-navy leading-tight">{product.name}</p>
                          {product.shortDescription && (
                            <p className="text-xs text-om-gray truncate max-w-[200px]">{product.shortDescription}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy/10 text-navy">
                        {product.category?.name || '—'}
                      </span>
                    </td>

                    {/* Featured toggle */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleToggle(product, 'isFeatured')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.isFeatured
                            ? 'text-orange bg-orange/10'
                            : 'text-om-gray hover:text-orange hover:bg-orange/10'
                        }`}
                        title={product.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star size={16} fill={product.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>

                    {/* Active toggle */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleToggle(product, 'isActive')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.isActive
                            ? 'text-green-600 bg-green-50'
                            : 'text-om-gray hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={product.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {product.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setModal({ type: 'edit', data: product })}
                          className="p-1.5 rounded-lg text-om-gray hover:text-navy hover:bg-light-gray transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setModal({ type: 'delete', data: product })}
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
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === 'create' && (
        <ProductModal categories={categories} onClose={closeModal} onSaved={afterSave} />
      )}
      {modal?.type === 'edit' && (
        <ProductModal product={modal.data} categories={categories} onClose={closeModal} onSaved={afterSave} />
      )}
      {modal?.type === 'delete' && (
        <DeleteConfirm product={modal.data} onClose={closeModal} onDeleted={afterSave} />
      )}
    </div>
  );
};

export default AdminProducts;
