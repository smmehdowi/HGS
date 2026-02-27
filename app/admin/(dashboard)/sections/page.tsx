'use client';

import { useEffect, useState } from 'react';
import { CustomSection } from '@/lib/admin-types';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const EMPTY_FORM: Omit<CustomSection, 'id'> = {
  titleEn: '',
  titleAr: '',
  contentEn: '',
  contentAr: '',
  imageUrl: '',
  ctaTextEn: '',
  ctaTextAr: '',
  ctaUrl: '',
  order: 1,
  visible: true,
};

export default function SectionsPage() {
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/sections');
    const data = await res.json();
    setSections(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditingId(null);
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.order)) : 0;
    setForm({ ...EMPTY_FORM, order: maxOrder + 1 });
    setShowForm(true);
    setMessage('');
  }

  function openEdit(section: CustomSection) {
    setEditingId(section.id);
    setForm({
      titleEn: section.titleEn,
      titleAr: section.titleAr,
      contentEn: section.contentEn,
      contentAr: section.contentAr,
      imageUrl: section.imageUrl ?? '',
      ctaTextEn: section.ctaTextEn ?? '',
      ctaTextAr: section.ctaTextAr ?? '',
      ctaUrl: section.ctaUrl ?? '',
      order: section.order,
      visible: section.visible,
    });
    setShowForm(true);
    setMessage('');
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setMessage('');
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    const isEdit = editingId !== null;
    const url = isEdit ? `/api/admin/sections/${editingId}` : '/api/admin/sections';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setMessage('✓ Saved!');
      closeForm();
      load();
    } else {
      setMessage('✗ Failed to save.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    await fetch(`/api/admin/sections/${id}`, { method: 'DELETE' });
    load();
  }

  async function toggleVisible(section: CustomSection) {
    await fetch(`/api/admin/sections/${section.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !section.visible }),
    });
    load();
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Sections</h1>
          <p className="text-gray-400 text-sm mt-1">
            Add custom content sections to the homepage. Sorted by Order number.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition"
        >
          <Plus size={16} /> Add Section
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">
              {editingId ? 'Edit Section' : 'New Section'}
            </h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Title (English)" value={form.titleEn} onChange={(v) => setForm((f) => ({ ...f, titleEn: v }))} />
            <Field label="Title (Arabic)" value={form.titleAr} onChange={(v) => setForm((f) => ({ ...f, titleAr: v }))} rtl />
            <Field label="Content (English)" value={form.contentEn} onChange={(v) => setForm((f) => ({ ...f, contentEn: v }))} textarea rows={5} />
            <Field label="Content (Arabic)" value={form.contentAr} onChange={(v) => setForm((f) => ({ ...f, contentAr: v }))} textarea rows={5} rtl />
            <Field label="CTA Button Text (English)" value={form.ctaTextEn ?? ''} onChange={(v) => setForm((f) => ({ ...f, ctaTextEn: v }))} />
            <Field label="CTA Button Text (Arabic)" value={form.ctaTextAr ?? ''} onChange={(v) => setForm((f) => ({ ...f, ctaTextAr: v }))} rtl />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <ImageUpload label="Image (optional)" value={form.imageUrl ?? ''} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
            </div>
            <Field label="CTA Button URL" value={form.ctaUrl ?? ''} onChange={(v) => setForm((f) => ({ ...f, ctaUrl: v }))} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Order (lower = first)</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 1 }))}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-2 pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm text-gray-300">Visible on website</span>
              </label>
            </div>
          </div>

          {message && <p className="mt-3 text-sm text-green-400">{message}</p>}

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-semibold transition"
            >
              <Check size={15} /> {saving ? 'Saving…' : 'Save Section'}
            </button>
            <button
              onClick={closeForm}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sections list */}
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : sections.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500">
          No sections yet. Click &quot;Add Section&quot; to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start gap-4"
            >
              <div className="text-xs text-gray-600 font-mono mt-1 w-6 text-center shrink-0">
                #{section.order}
              </div>
              {section.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={section.imageUrl}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {!section.visible && (
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">Hidden</span>
                  )}
                  <h3 className="text-white font-semibold truncate">{section.titleEn || '(no title)'}</h3>
                </div>
                <p className="text-gray-400 text-sm truncate">{section.titleAr}</p>
                {section.ctaUrl && (
                  <p className="text-gray-500 text-xs mt-1 truncate">
                    CTA → {section.ctaTextEn} ({section.ctaUrl})
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <IconBtn onClick={() => toggleVisible(section)} title={section.visible ? 'Hide' : 'Show'}>
                  {section.visible ? <EyeOff size={15} /> : <Eye size={15} />}
                </IconBtn>
                <IconBtn onClick={() => openEdit(section)} title="Edit">
                  <Pencil size={15} />
                </IconBtn>
                <IconBtn onClick={() => handleDelete(section.id)} title="Delete" danger>
                  <Trash2 size={15} />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, textarea, rows = 3, rtl,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  rtl?: boolean;
}) {
  const cls = `w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 ${rtl ? 'text-right' : ''}`;
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          dir={rtl ? 'rtl' : 'ltr'}
          className={cls}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={rtl ? 'rtl' : 'ltr'}
          className={cls}
        />
      )}
    </div>
  );
}

function IconBtn({
  children, onClick, title, danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition ${danger ? 'text-gray-400 hover:bg-red-900/50 hover:text-red-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
      {children}
    </button>
  );
}
