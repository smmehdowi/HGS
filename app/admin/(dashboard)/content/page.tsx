'use client';

import { useEffect, useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

// ─── Types ────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentMap = Record<string, any>;

// ─── Sections configuration ──────────────────────────────────────────────────
const SECTIONS = [
  {
    key: 'common',
    label: 'Company',
    fields: [
      { key: 'company_name', label: 'Company Name', type: 'text' },
      { key: 'tagline', label: 'Company Tagline', type: 'text' },
      { key: 'navbar_tagline', label: 'Navbar Subtitle (under company name)', type: 'text' },
    ],
  },
  {
    key: 'hero',
    label: 'Hero Banner',
    fields: [
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'cta_primary', label: 'Primary Button', type: 'text' },
      { key: 'cta_secondary', label: 'Secondary Button', type: 'text' },
      { key: 'background_image', label: 'Background Image', type: 'image', shared: true },
      { key: 'exclusive_distributor', label: 'Exclusive Distributor Text', type: 'text' },
      { key: 'exclusive_distributor_visible', label: 'Show Exclusive Distributor Badge', type: 'checkbox', shared: true },
    ],
  },
  {
    key: 'nav',
    label: 'Navigation',
    fields: [
      { key: 'home', label: 'Home', type: 'text' },
      { key: 'about', label: 'About', type: 'text' },
      { key: 'products', label: 'Products', type: 'text' },
      { key: 'projects', label: 'Projects', type: 'text' },
      { key: 'services', label: 'Services', type: 'text' },
      { key: 'contact', label: 'Contact', type: 'text' },
      { key: 'quote', label: 'Get a Quote', type: 'text' },
    ],
  },
  {
    key: 'stats',
    label: 'Statistics',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'years_value', label: 'Years — Number', type: 'text', shared: true },
      { key: 'years_suffix', label: 'Years — Suffix (e.g. +)', type: 'text', shared: true },
      { key: 'years', label: 'Years — Label', type: 'text' },
      { key: 'projects_value', label: 'Projects — Number', type: 'text', shared: true },
      { key: 'projects_suffix', label: 'Projects — Suffix', type: 'text', shared: true },
      { key: 'projects', label: 'Projects — Label', type: 'text' },
      { key: 'varieties_value', label: 'Varieties — Number', type: 'text', shared: true },
      { key: 'varieties_suffix', label: 'Varieties — Suffix', type: 'text', shared: true },
      { key: 'varieties', label: 'Varieties — Label', type: 'text' },
      { key: 'tons_value', label: 'Tons — Number', type: 'text', shared: true },
      { key: 'tons_suffix', label: 'Tons — Suffix', type: 'text', shared: true },
      { key: 'tons', label: 'Tons — Label', type: 'text' },
      { key: 'background_image', label: 'Background Image', type: 'image', shared: true },
    ],
  },
  {
    key: 'products',
    label: 'Collections Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'slate.name', label: 'Slate — Name', type: 'text' },
      { key: 'slate.description', label: 'Slate — Description', type: 'textarea' },
      { key: 'slate.count', label: 'Slate — Count label', type: 'text' },
      { key: 'marble.name', label: 'Marble — Name', type: 'text' },
      { key: 'marble.description', label: 'Marble — Description', type: 'textarea' },
      { key: 'marble.count', label: 'Marble — Count label', type: 'text' },
      { key: 'granite.name', label: 'Granite — Name', type: 'text' },
      { key: 'granite.description', label: 'Granite — Description', type: 'textarea' },
      { key: 'granite.count', label: 'Granite — Count label', type: 'text' },
    ],
  },
  {
    key: 'categories',
    label: 'Product Category Pages',
    fields: [
      { key: 'slate.page_title', label: 'Slate Page Title', type: 'text' },
      { key: 'slate.page_desc', label: 'Slate Page Description', type: 'textarea' },
      { key: 'slate.hero_image', label: 'Slate Hero Image', type: 'image', shared: true},
      { key: 'marble.page_title', label: 'Marble Page Title', type: 'text' },
      { key: 'marble.page_desc', label: 'Marble Page Description', type: 'textarea' },
      { key: 'marble.hero_image', label: 'Marble Hero Image', type: 'image', shared: true},
      { key: 'granite.page_title', label: 'Granite Page Title', type: 'text' },
      { key: 'granite.page_desc', label: 'Granite Page Description', type: 'textarea' },
      { key: 'granite.hero_image', label: 'Granite Hero Image', type: 'image', shared: true},
    ],
  },
  {
    key: 'why_us',
    label: 'Why Choose Us',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
      { key: 'direct_import', label: 'Feature 1 — Title', type: 'text' },
      { key: 'direct_import_desc', label: 'Feature 1 — Description', type: 'textarea' },
      { key: 'saudi_delivery', label: 'Feature 2 — Title', type: 'text' },
      { key: 'saudi_delivery_desc', label: 'Feature 2 — Description', type: 'textarea' },
      { key: 'custom_cutting', label: 'Feature 3 — Title', type: 'text' },
      { key: 'custom_cutting_desc', label: 'Feature 3 — Description', type: 'textarea' },
      { key: 'quality', label: 'Feature 4 — Title', type: 'text' },
      { key: 'quality_desc', label: 'Feature 4 — Description', type: 'textarea' },
    ],
  },
  {
    key: 'sourcing',
    label: 'Sourcing Story',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'textarea' },
      { key: 'step1', label: 'Step 1 — Title', type: 'text' },
      { key: 'step1_desc', label: 'Step 1 — Description', type: 'textarea' },
      { key: 'step2', label: 'Step 2 — Title', type: 'text' },
      { key: 'step2_desc', label: 'Step 2 — Description', type: 'textarea' },
      { key: 'step3', label: 'Step 3 — Title', type: 'text' },
      { key: 'step3_desc', label: 'Step 3 — Description', type: 'textarea' },
      { key: 'step4', label: 'Step 4 — Title', type: 'text' },
      { key: 'step4_desc', label: 'Step 4 — Description', type: 'textarea' },
      { key: 'step5', label: 'Step 5 — Title', type: 'text' },
      { key: 'step5_desc', label: 'Step 5 — Description', type: 'textarea' },
    ],
  },
  {
    key: 'cta_banner',
    label: 'CTA Banner',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'button', label: 'Button Text', type: 'text' },
    ],
  },
  {
    key: 'announcement',
    label: 'Announcement Bar',
    fields: [
      { key: 'text', label: 'Announcement Text', type: 'text' },
      { key: 'cta', label: 'CTA Button', type: 'text' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact Info',
    fields: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'hours_value', label: 'Working Hours', type: 'text' },
      { key: 'hours_note', label: 'Hours Note', type: 'text' },
      { key: 'office_title', label: 'Office Section Title', type: 'text' },
    ],
  },
  {
    key: 'footer',
    label: 'Footer',
    fields: [
      { key: 'description', label: 'Company Description', type: 'textarea' },
      { key: 'exclusive_distributor', label: 'Distributor Text', type: 'text' },
      { key: 'copyright', label: 'Copyright Text', type: 'text' },
    ],
  },
  {
    key: 'about',
    label: 'About Page',
    fields: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'story_title', label: 'Story — Title', type: 'text' },
      { key: 'story_body', label: 'Story — Body', type: 'textarea' },
      { key: 'mission_title', label: 'Mission — Title', type: 'text' },
      { key: 'mission_body', label: 'Mission — Body', type: 'textarea' },
      { key: 'vision_title', label: 'Vision — Title', type: 'text' },
      { key: 'vision_body', label: 'Vision — Body', type: 'textarea' },
      { key: 'distributor_title', label: 'Distributor — Title', type: 'text' },
      { key: 'distributor_body', label: 'Distributor — Body', type: 'textarea' },
    ],
  },
  {
    key: 'services',
    label: 'Services Page',
    fields: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'import_title', label: 'Service 1 — Title', type: 'text' },
      { key: 'import_desc', label: 'Service 1 — Description', type: 'textarea' },
      { key: 'cutting_title', label: 'Service 2 — Title', type: 'text' },
      { key: 'cutting_desc', label: 'Service 2 — Description', type: 'textarea' },
      { key: 'finishing_title', label: 'Service 3 — Title', type: 'text' },
      { key: 'finishing_desc', label: 'Service 3 — Description', type: 'textarea' },
      { key: 'delivery_title', label: 'Service 4 — Title', type: 'text' },
      { key: 'delivery_desc', label: 'Service 4 — Description', type: 'textarea' },
      { key: 'consultation_title', label: 'Service 5 — Title', type: 'text' },
      { key: 'consultation_desc', label: 'Service 5 — Description', type: 'textarea' },
      { key: 'wholesale_title', label: 'Service 6 — Title', type: 'text' },
      { key: 'wholesale_desc', label: 'Service 6 — Description', type: 'textarea' },
    ],
  },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getNestedValue(obj: ContentMap, dotKey: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = dotKey.split('.').reduce((acc: any, k: string) => acc?.[k], obj);
  return (result as string) ?? '';
}

function setNestedValue(obj: ContentMap, dotKey: string, value: string): ContentMap {
  const keys = dotKey.split('.');
  const result = JSON.parse(JSON.stringify(obj));
  let cur = result;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return result;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContentPage() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].key);
  const [enContent, setEnContent] = useState<ContentMap>({});
  const [arContent, setArContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [en, ar] = await Promise.all([
      fetch('/api/admin/content?locale=en').then((r) => r.json()),
      fetch('/api/admin/content?locale=ar').then((r) => r.json()),
    ]);
    setEnContent(en);
    setArContent(ar);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    setMessage('');
    const [r1, r2] = await Promise.all([
      fetch('/api/admin/content?locale=en', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enContent),
      }),
      fetch('/api/admin/content?locale=ar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arContent),
      }),
    ]);
    setSaving(false);
    setMessage(r1.ok && r2.ok
      ? '✓ Saved! Refresh the website to see changes.'
      : '✗ Save failed. Try again.');
  }

  const section = SECTIONS.find((s) => s.key === activeSection)!;

  function getEn(dotKey: string) {
    return getNestedValue(enContent[section.key] ?? {}, dotKey);
  }
  function getAr(dotKey: string) {
    return getNestedValue(arContent[section.key] ?? {}, dotKey);
  }
  function setEn(dotKey: string, val: string) {
    setEnContent((prev) => {
      const sec = setNestedValue(prev[section.key] ?? {}, dotKey, val);
      return { ...prev, [section.key]: sec };
    });
  }
  function setAr(dotKey: string, val: string) {
    setArContent((prev) => {
      const sec = setNestedValue(prev[section.key] ?? {}, dotKey, val);
      return { ...prev, [section.key]: sec };
    });
  }
  // For shared fields (same value in both locales, like image URLs and numbers)
  function setShared(dotKey: string, val: string) {
    setEn(dotKey, val);
    setArContent((prev) => {
      const sec = setNestedValue(prev[section.key] ?? {}, dotKey, val);
      return { ...prev, [section.key]: sec };
    });
  }

  return (
    <div className="flex gap-6 max-w-7xl">
      {/* Section tabs (left column) */}
      <nav className="w-44 shrink-0 space-y-1">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => { setActiveSection(s.key); setMessage(''); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              activeSection === s.key
                ? 'bg-amber-600 text-white font-medium'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Editor panel */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{section.label}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Edit in both English (left) and Arabic (right). Changes apply on next page load.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-semibold transition"
          >
            <Check size={15} /> {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>

        {message && (
          <div className={`mb-5 p-3 rounded-lg text-sm ${message.startsWith('✓') ? 'bg-green-900/50 text-green-300 border border-green-800' : 'bg-red-900/50 text-red-300 border border-red-800'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading content…</p>
        ) : (
          <div className="space-y-5">
            {section.fields.map((field) => {
              const isShared = 'shared' in field && field.shared;
              return (
                <div key={field.key} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-3">
                    {field.label}
                    {isShared && (
                      <span className="ml-2 text-gray-500 normal-case font-normal">(same for both languages)</span>
                    )}
                  </div>
                  {isShared ? (
                    <FieldInput
                      type={field.type}
                      value={getEn(field.key)}
                      onChange={(v) => setShared(field.key, v)}
                      placeholder={field.label}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1.5">English</div>
                        <FieldInput
                          type={field.type}
                          value={getEn(field.key)}
                          onChange={(v) => setEn(field.key, v)}
                          placeholder={`${field.label} (English)`}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1.5">العربية</div>
                        <FieldInput
                          type={field.type}
                          value={getAr(field.key)}
                          onChange={(v) => setAr(field.key, v)}
                          placeholder={`${field.label} (Arabic)`}
                          rtl
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FieldInput({
  type, value, onChange, placeholder, rtl,
}: {
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rtl?: boolean;
}) {
  const cls = `w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 ${rtl ? 'text-right' : ''}`;
  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={value !== 'false'}
          onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
          className="w-4 h-4 accent-amber-500"
        />
        <span className="text-sm text-gray-300">
          {value === 'false' ? 'Hidden' : 'Visible'}
        </span>
      </label>
    );
  }
  if (type === 'image') {
    return <ImageUpload label="" value={value} onChange={onChange} />;
  }
  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        dir={rtl ? 'rtl' : 'ltr'}
        placeholder={placeholder}
        className={cls}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir={rtl ? 'rtl' : 'ltr'}
      placeholder={placeholder}
      className={cls}
    />
  );
}
