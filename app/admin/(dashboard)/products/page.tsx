'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

type Category = 'slate' | 'marble' | 'granite';

interface StoneProduct {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: Category;
  colors: string[];
  colorsAr?: string[];
  finishes: string[];
  finishesAr?: string[];
  applications: string[];
  applicationsAr?: string[];
  origin: string;
  originAr?: string;
  sizes: string[];
  thickness: string[];
  image: string;
  priceFrom?: number;
  priceTo?: number;
  discountPercent?: number;
  visible?: boolean;
}

const EMPTY: Omit<StoneProduct, 'id'> = {
  nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '',
  category: 'granite',
  colors: [], colorsAr: [],
  finishes: [], finishesAr: [],
  applications: [], applicationsAr: [],
  origin: 'India', originAr: '',
  sizes: [], thickness: [], image: '',
  priceFrom: undefined, priceTo: undefined, discountPercent: undefined,
  visible: true,
};

const CATEGORIES: Category[] = ['slate', 'marble', 'granite'];

function TagInput({ label, value, onChange, dir }: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  dir?: 'rtl' | 'ltr';
}) {
  const [input, setInput] = useState('');

  function add() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  }

  function remove(item: string) {
    onChange(value.filter((v) => v !== item));
  }

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-1.5" dir={dir}>
        {value.map((item) => (
          <span key={item} className="flex items-center gap-1 bg-gray-700 text-gray-200 text-xs px-2 py-0.5 rounded">
            {item}
            <button onClick={() => remove(item)} className="text-gray-400 hover:text-red-400 ml-0.5">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          dir={dir}
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500"
          placeholder={dir === 'rtl' ? 'أضف...' : `Add ${label.toLowerCase()}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        />
        <button
          onClick={add}
          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<StoneProduct, 'id'> & { id?: string };
  onSave: (data: Omit<StoneProduct, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    if (!form.nameEn.trim() || !form.nameAr.trim()) {
      alert('Name (EN) and Name (AR) are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof typeof form, label: string, type: 'text' | 'textarea' = 'text') => (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 resize-y"
          value={form[key] as string}
          onChange={(e) => set(key, e.target.value as never)}
        />
      ) : (
        <input
          type="text"
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          value={form[key] as string}
          onChange={(e) => set(key, e.target.value as never)}
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-3xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">
            {initial.id ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Category + Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                value={form.category}
                onChange={(e) => set('category', e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.visible !== false}
                  onChange={(e) => set('visible', e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm text-gray-300">Visible on site</span>
              </label>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            {field('nameEn', 'Name (English)')}
            {field('nameAr', 'Name (Arabic)')}
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-2 gap-4">
            {field('descriptionEn', 'Description (English)', 'textarea')}
            {field('descriptionAr', 'Description (Arabic)', 'textarea')}
          </div>

          {/* Image + Origin */}
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              label="Image"
              value={form.image}
              onChange={(url) => set('image', url)}
            />
            <div className="space-y-3">
              {field('origin', 'Origin (English)')}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Origin (Arabic)</label>
                <input
                  type="text"
                  dir="rtl"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="مثال: الهند"
                  value={form.originAr ?? ''}
                  onChange={(e) => set('originAr', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Colors EN | AR */}
          <div className="grid grid-cols-2 gap-4">
            <TagInput label="Colors (English)" value={form.colors} onChange={(v) => set('colors', v)} />
            <TagInput label="Colors (Arabic)" dir="rtl" value={form.colorsAr ?? []} onChange={(v) => set('colorsAr', v)} />
          </div>

          {/* Finishes EN | AR */}
          <div className="grid grid-cols-2 gap-4">
            <TagInput label="Finishes (English)" value={form.finishes} onChange={(v) => set('finishes', v)} />
            <TagInput label="Finishes (Arabic)" dir="rtl" value={form.finishesAr ?? []} onChange={(v) => set('finishesAr', v)} />
          </div>

          {/* Applications EN | AR */}
          <div className="grid grid-cols-2 gap-4">
            <TagInput label="Applications (English)" value={form.applications} onChange={(v) => set('applications', v)} />
            <TagInput label="Applications (Arabic)" dir="rtl" value={form.applicationsAr ?? []} onChange={(v) => set('applicationsAr', v)} />
          </div>

          {/* Sizes + Thickness (no translation needed) */}
          <div className="grid grid-cols-2 gap-4">
            <TagInput label="Sizes" value={form.sizes} onChange={(v) => set('sizes', v)} />
            <TagInput label="Thickness" value={form.thickness} onChange={(v) => set('thickness', v)} />
          </div>

          {/* Pricing */}
          <div className="border-t border-gray-800 pt-4">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Pricing (optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price From (SAR)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 50"
                  value={form.priceFrom ?? ''}
                  onChange={(e) => set('priceFrom', e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price To (SAR)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 120"
                  value={form.priceTo ?? ''}
                  onChange={(e) => set('priceTo', e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Discount % (1–99)</label>
              <input
                type="number"
                min={1}
                max={99}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g. 10 for 10% off — leave blank to hide"
                value={form.discountPercent ?? ''}
                onChange={(e) => set('discountPercent', e.target.value === '' ? undefined : Math.min(99, Math.max(1, Number(e.target.value))))}
              />
              <p className="text-gray-500 text-xs mt-1">Shows a diagonal &quot;X% OFF&quot; ribbon and auto-calculates discounted prices.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition"
          >
            <Check size={15} />
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<StoneProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<(Omit<StoneProduct, 'id'> & { id?: string }) | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch {
      showToast('Failed to load products', false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: Omit<StoneProduct, 'id'> & { id?: string }) {
    const isEdit = Boolean(data.id);
    const url = isEdit ? `/api/admin/products/${data.id}` : '/api/admin/products';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditing(null);
      showToast(isEdit ? 'Product updated!' : 'Product added!');
      await load();
    } else {
      showToast('Save failed', false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Product deleted');
      await load();
    } else {
      showToast('Delete failed', false);
    }
  }

  async function toggleVisible(product: StoneProduct) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, visible: !product.visible }),
    });
    if (res.ok) {
      await load();
    }
  }

  const filtered = products.filter((p) => {
    const matchCat = filter === 'all' || p.category === filter;
    const matchSearch = !search || p.nameEn.toLowerCase().includes(search.toLowerCase()) || p.nameAr.includes(search);
    return matchCat && matchSearch;
  });

  const counts = { all: products.length, slate: 0, marble: 0, granite: 0 };
  products.forEach((p) => { counts[p.category]++; });

  return (
    <div className="p-6 max-w-6xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg ${
          toast.ok ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <button
          onClick={() => setEditing(EMPTY)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
          {(['all', ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                filter === cat
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({counts[cat]})
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 w-52"
        />
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-sm py-12 text-center">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className={`bg-gray-800 border rounded-xl overflow-hidden ${
                product.visible === false ? 'border-gray-700 opacity-60' : 'border-gray-700'
              }`}
            >
              {/* Image */}
              <div className="h-36 bg-gray-900 relative overflow-hidden">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.nameEn}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No image</div>
                )}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium capitalize ${
                  product.category === 'granite' ? 'bg-gray-900/80 text-amber-400' :
                  product.category === 'marble' ? 'bg-gray-900/80 text-blue-400' :
                  'bg-gray-900/80 text-green-400'
                }`}>
                  {product.category}
                </span>
                {product.discountPercent && product.discountPercent > 0 ? (
                  <div
                    className="absolute bg-red-600 text-white font-bold text-center shadow-md pointer-events-none"
                    style={{
                      top: '12px',
                      right: '-22px',
                      width: '90px',
                      padding: '3px 0',
                      fontSize: '10px',
                      letterSpacing: '0.04em',
                      transform: 'rotate(45deg)',
                    }}
                  >
                    {product.discountPercent}% OFF
                  </div>
                ) : null}
                {product.visible === false && (
                  <span className="absolute top-2 right-2 bg-gray-900/80 text-gray-400 text-xs px-2 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{product.nameEn}</p>
                    <p className="text-gray-400 text-xs truncate" dir="rtl">{product.nameAr}</p>
                  </div>
                </div>
                {(product.priceFrom || product.priceTo) && (
                  <div className="mt-1">
                    {product.discountPercent && product.discountPercent > 0 ? (
                      <>
                        <p className="text-gray-500 text-xs line-through leading-none">
                          SAR {product.priceFrom ?? '—'}{product.priceTo ? ` – ${product.priceTo}` : ''}
                        </p>
                        <p className="text-red-400 text-xs font-semibold leading-tight">
                          SAR {product.priceFrom ? Math.round(product.priceFrom * (1 - product.discountPercent / 100)) : '—'}
                          {product.priceTo ? ` – ${Math.round(product.priceTo * (1 - product.discountPercent / 100))}` : ''}
                        </p>
                      </>
                    ) : (
                      <p className="text-amber-400 text-xs">
                        SAR {product.priceFrom ?? '—'}{product.priceTo ? ` – ${product.priceTo}` : ''}
                      </p>
                    )}
                  </div>
                )}
                {product.colors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.colors.slice(0, 3).map((c) => (
                      <span key={c} className="bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded">{c}</span>
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-gray-500 text-xs py-0.5">+{product.colors.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-3 pb-3">
                <button
                  onClick={() => setEditing(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs transition"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => toggleVisible(product)}
                  title={product.visible === false ? 'Show product' : 'Hide product'}
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-lg transition"
                >
                  {product.visible === false ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.nameEn)}
                  className="p-1.5 bg-gray-700 hover:bg-red-900 text-gray-400 hover:text-red-400 rounded-lg transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {editing !== null && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
