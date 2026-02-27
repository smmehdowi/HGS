'use client';

import { useEffect, useState } from 'react';
import {
  ChevronUp, ChevronDown, Eye, EyeOff, Plus, Trash2,
  LayoutTemplate, Star, Tag,
} from 'lucide-react';
import { HomeSectionType, HomeSection } from '@/lib/admin-types';

const SECTION_META: Record<HomeSectionType, { label: string; description: string; icon: React.ReactNode; removable: boolean }> = {
  hero:               { label: 'Hero',               description: 'Full-width hero with headline and CTAs',        icon: <LayoutTemplate size={16} />, removable: false },
  product_categories: { label: 'Product Categories', description: 'Slate, Marble, Granite category cards',         icon: <LayoutTemplate size={16} />, removable: false },
  why_choose_us:      { label: 'Why Choose Us',      description: 'Feature grid with 4 benefit highlights',        icon: <LayoutTemplate size={16} />, removable: false },
  sourcing_story:     { label: 'Sourcing Story',     description: 'Story section with sourcing process steps',     icon: <LayoutTemplate size={16} />, removable: false },
  statistics:         { label: 'Statistics',         description: 'Animated counters (years, projects, etc.)',     icon: <LayoutTemplate size={16} />, removable: false },
  custom_sections:    { label: 'Custom Sections',    description: 'Admin-created rich content sections',           icon: <LayoutTemplate size={16} />, removable: false },
  news:               { label: 'News & Updates',     description: 'Latest 3 news articles',                       icon: <LayoutTemplate size={16} />, removable: false },
  cta_banner:         { label: 'CTA Banner',         description: 'Call-to-action banner with quote button',      icon: <LayoutTemplate size={16} />, removable: false },
  popular_products:   { label: 'Popular Products',   description: 'Grid showing your top products',               icon: <Star   size={16} />, removable: true },
  discounted_products:{ label: 'Discounted Products',description: 'Products with an active discount / sale price', icon: <Tag    size={16} />, removable: true },
};

// Section types that can be added (not present in the default layout)
const ADDABLE_TYPES: HomeSectionType[] = ['popular_products', 'discounted_products'];

export default function HomeLayoutPage() {
  const [layout, setLayout]   = useState<HomeSection[]>([]);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ msg: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/home-layout')
      .then((r) => r.json())
      .then((data) => { setLayout(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function save(next: HomeSection[]) {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/home-layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error();
      showToast('Layout saved', true);
    } catch {
      showToast('Failed to save', false);
    } finally {
      setSaving(false);
    }
  }

  function reorder(index: number, dir: -1 | 1) {
    const next = [...layout];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    // Re-assign order values to match array position
    const normalised = next.map((s, i) => ({ ...s, order: i }));
    setLayout(normalised);
    save(normalised);
  }

  function toggle(id: string) {
    const next = layout.map((s) => s.id === id ? { ...s, visible: !s.visible } : s);
    setLayout(next);
    save(next);
  }

  function remove(id: string) {
    const next = layout.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i }));
    setLayout(next);
    save(next);
  }

  function addSection(type: HomeSectionType) {
    const id = `${type}_${Date.now()}`;
    const next = [...layout, { id, type, visible: true, order: layout.length }];
    setLayout(next);
    save(next);
  }

  const sorted = [...layout].sort((a, b) => a.order - b.order);
  const presentTypes = new Set(layout.map((s) => s.type));
  const available = ADDABLE_TYPES.filter((t) => !presentTypes.has(t));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading layout…
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Home Page Layout</h1>
        <p className="text-gray-400 text-sm">
          Reorder sections with the arrows, toggle visibility, and add optional section types.
          Changes save instantly.
        </p>
      </div>

      {/* Section list */}
      <div className="space-y-2 mb-8">
        {sorted.map((section, index) => {
          const meta = SECTION_META[section.type];
          return (
            <div
              key={section.id}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                section.visible
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-gray-950 border-gray-800 opacity-60'
              }`}
            >
              {/* Order arrows */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => reorder(index, -1)}
                  disabled={index === 0 || saving}
                  className="p-1 rounded text-gray-500 hover:text-white hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition"
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => reorder(index, 1)}
                  disabled={index === sorted.length - 1 || saving}
                  className="p-1 rounded text-gray-500 hover:text-white hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition"
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Icon */}
              <div className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center text-amber-400 shrink-0">
                {meta.icon}
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{meta.label}</p>
                <p className="text-gray-500 text-xs truncate">{meta.description}</p>
              </div>

              {/* Visible badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                section.visible ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {section.visible ? 'Visible' : 'Hidden'}
              </span>

              {/* Toggle visibility */}
              <button
                onClick={() => toggle(section.id)}
                disabled={saving}
                className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition"
                title={section.visible ? 'Hide section' : 'Show section'}
              >
                {section.visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>

              {/* Remove (only for removable types) */}
              {meta.removable && (
                <button
                  onClick={() => remove(section.id)}
                  disabled={saving}
                  className="p-2 rounded text-gray-500 hover:text-red-400 hover:bg-gray-700 transition"
                  title="Remove section"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add section */}
      {available.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">
            Add Section
          </p>
          <div className="flex flex-wrap gap-3">
            {available.map((type) => {
              const meta = SECTION_META[type];
              return (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-700 hover:border-amber-500 hover:bg-gray-800 rounded-lg text-sm text-gray-300 hover:text-white transition"
                >
                  <Plus size={14} className="text-amber-400" />
                  <span className="text-amber-400 mr-0.5">{meta.icon}</span>
                  {meta.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            These sections are optional and only appear when relevant data exists (e.g. products with discounts).
          </p>
        </div>
      )}

      {/* Saving indicator */}
      {saving && (
        <p className="text-xs text-amber-400 mt-4">Saving…</p>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
          toast.ok ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
