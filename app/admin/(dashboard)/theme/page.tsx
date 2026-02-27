'use client';

import { useEffect, useState } from 'react';
import { ThemeSettings } from '@/lib/admin-types';

const COLOR_LABELS: Record<string, string> = {
  obsidian: 'Obsidian (Dark text / dark bg)',
  marbleWhite: 'Marble White (Light bg)',
  gold: 'Gold (Accents)',
  goldLight: 'Gold Light (Hover accents)',
  warmGray: 'Warm Gray (Muted text)',
  slateDark: 'Slate Dark (Card bg)',
  sand: 'Sand (Section bg)',
  deepGreen: 'Deep Green (Primary buttons)',
  deepGreenHover: 'Deep Green Hover (Button hover)',
  slateBlue: 'Slate Blue (Secondary text)',
};

const FONT_OPTIONS_EN = [
  'Playfair Display',
  'DM Sans',
  'Georgia',
  'Arial',
  'Helvetica Neue',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];

const FONT_OPTIONS_AR = [
  'Tajawal',          // Recommended — modern, clean, excellent for body & UI
  'Cairo',            // Bold & elegant — great for headings
  'Almarai',          // Designed in Saudi Arabia — professional body font
  'Noto Kufi Arabic', // Kufic calligraphic style — headings/display
  'IBM Plex Sans Arabic', // Technical, neutral body font
];

const DEFAULT_THEME: ThemeSettings = {
  colors: {
    obsidian: '#1a1a1a',
    marbleWhite: '#f5f0eb',
    gold: '#c9a96e',
    goldLight: '#e4c99a',
    warmGray: '#8a8279',
    slateDark: '#3a3a3c',
    sand: '#e8ddd0',
    deepGreen: '#0d5e37',
    deepGreenHover: '#0a4d2e',
    slateBlue: '#4a5568',
  },
  fonts: {
    enHeading: 'Playfair Display',
    enBody: 'DM Sans',
    arHeading: 'Cairo',
    arBody: 'Tajawal',
  },
  fontSizes: {
    heroEn: '4.5rem',
    heroAr: '4rem',
    h2En: '2rem',
    h2Ar: '1.85rem',
    bodyEn: '1rem',
    bodyAr: '1.1rem',
  },
  social: {
    tiktok: '',
    x: '',
    instagram: '',
    snapchat: '',
  },
};

export default function ThemePage() {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/theme')
      .then((r) => r.json())
      .then((data) => setTheme(data));
  }, []);

  function setColor(key: string, value: string) {
    setTheme((t) => ({ ...t, colors: { ...t.colors, [key]: value } }));
  }

  function setFont(key: string, value: string) {
    setTheme((t) => ({ ...t, fonts: { ...t.fonts, [key]: value } }));
  }

  function setFontSize(key: string, value: string) {
    setTheme((t) => ({ ...t, fontSizes: { ...t.fontSizes, [key]: value } }));
  }

  function setSocial(key: string, value: string) {
    setTheme((t) => ({ ...t, social: { ...t.social, [key]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(theme),
    });
    setSaving(false);
    setMessage(res.ok ? '✓ Theme saved! Refresh the website to see changes.' : '✗ Save failed.');
  }

  async function handleReset() {
    setTheme(DEFAULT_THEME);
    setMessage('Reset to defaults — click Save to apply.');
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Theme</h1>
          <p className="text-gray-400 text-sm mt-1">Adjust brand colors and typography</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-semibold transition"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${message.startsWith('✓') ? 'bg-green-900/50 text-green-300 border border-green-800' : 'bg-red-900/50 text-red-300 border border-red-800'}`}>
          {message}
        </div>
      )}

      {/* Colors */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-5">Brand Colors</h2>
        <div className="space-y-4">
          {(Object.entries(theme.colors) as [string, string][]).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <input
                type="color"
                value={value}
                onChange={(e) => setColor(key, e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer p-0.5"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-200">
                  {COLOR_LABELS[key] ?? key}
                </div>
                <div className="text-xs text-gray-500 font-mono">{value}</div>
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => setColor(key, e.target.value)}
                className="w-28 bg-gray-800 border border-gray-700 text-gray-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Fonts */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">Typography</h2>
        <p className="text-gray-400 text-xs mb-5">
          Arabic fonts are loaded from Google Fonts and designed specifically for Arabic script.
          <span className="text-amber-400 font-medium"> Tajawal</span> and
          <span className="text-amber-400 font-medium"> Cairo</span> are recommended for best readability.
        </p>
        <div className="grid grid-cols-2 gap-5">
          {[
            { key: 'enHeading', label: 'English Headings', options: FONT_OPTIONS_EN },
            { key: 'enBody',    label: 'English Body',     options: FONT_OPTIONS_EN },
            { key: 'arHeading', label: 'Arabic Headings',  options: FONT_OPTIONS_AR },
            { key: 'arBody',    label: 'Arabic Body / Nav', options: FONT_OPTIONS_AR },
          ].map(({ key, label, options }) => (
            <div key={key}>
              <label className="block text-sm text-gray-300 mb-1.5">{label}</label>
              <select
                value={(theme.fonts as Record<string, string>)[key]}
                onChange={(e) => setFont(key, e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
              >
                {options.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <p className="text-gray-600 text-xs mt-1"
                style={{ fontFamily: `'${(theme.fonts as Record<string, string>)[key]}', sans-serif`, direction: key.startsWith('ar') ? 'rtl' : 'ltr' }}>
                {key.startsWith('ar') ? 'معاينة النص العربي — الأحجار الطبيعية' : 'Preview — Natural Stone Supplier'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Font Sizes */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Font Sizes</h2>
        <p className="text-gray-400 text-xs mb-5">
          Use CSS units: <span className="font-mono text-gray-300">rem</span>, <span className="font-mono text-gray-300">px</span>, <span className="font-mono text-gray-300">em</span>, etc.
          Arabic script appears visually smaller, so Arabic sizes are set slightly larger by default.
        </p>
        <div className="grid grid-cols-2 gap-5">
          {[
            { key: 'heroEn', label: 'Hero Headline — English' },
            { key: 'heroAr', label: 'Hero Headline — Arabic' },
            { key: 'h2En',   label: 'Section Headings (H2) — English' },
            { key: 'h2Ar',   label: 'Section Headings (H2) — Arabic' },
            { key: 'bodyEn', label: 'Body Text — English' },
            { key: 'bodyAr', label: 'Body Text — Arabic' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm text-gray-300 mb-1.5">{label}</label>
              <input
                type="text"
                value={(theme.fontSizes as Record<string, string>)[key] ?? ''}
                onChange={(e) => setFontSize(key, e.target.value)}
                placeholder="e.g. 4.5rem"
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Social Media Links */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Social Media Links</h2>
        <p className="text-gray-400 text-xs mb-5">
          Leave blank to hide an icon. Full URLs including https://.
        </p>
        <div className="space-y-4">
          {[
            { key: 'instagram', label: 'Instagram',       placeholder: 'https://instagram.com/yourpage' },
            { key: 'x',         label: 'X (Twitter)',     placeholder: 'https://x.com/yourhandle' },
            { key: 'tiktok',    label: 'TikTok',          placeholder: 'https://tiktok.com/@yourpage' },
            { key: 'snapchat',  label: 'Snapchat',        placeholder: 'https://snapchat.com/add/yourname' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="flex items-center gap-4">
              <label className="w-28 text-sm text-gray-300 shrink-0">{label}</label>
              <input
                type="url"
                value={(theme.social as unknown as Record<string, string>)?.[key] ?? ''}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
