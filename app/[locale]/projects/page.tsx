'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

// Sample project data
const projects = [
  { id: 1, titleEn: 'Luxury Villa — Riyadh',         titleAr: 'فيلا فاخرة — الرياض',      stoneEn: 'Makrana White Marble', stoneAr: 'رخام ماكرانا الأبيض', type: 'residential', city: 'Riyadh',  stone: 'marble',  img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&q=80' },
  { id: 2, titleEn: 'Commercial Tower — Jeddah',     titleAr: 'برج تجاري — جدة',           stoneEn: 'Steel Grey Granite',  stoneAr: 'جرانيت رمادي فولاذي',   type: 'commercial', city: 'Jeddah',  stone: 'granite', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80' },
  { id: 3, titleEn: 'Hotel Lobby — Dammam',          titleAr: 'ردهة فندق — الدمام',        stoneEn: 'Kota Blue Slate',     stoneAr: 'أردواز كوتا الأزرق',    type: 'hospitality', city: 'Dammam', stone: 'slate',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id: 4, titleEn: 'Villa Landscape — Jeddah',      titleAr: 'منسقة فيلا — جدة',          stoneEn: 'Raj Green Slate',     stoneAr: 'أردواز راج الأخضر',     type: 'landscaping', city: 'Jeddah', stone: 'slate',   img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80' },
  { id: 5, titleEn: 'Mosque Interior — Makkah',      titleAr: 'ديكور مسجد — مكة المكرمة', stoneEn: 'Ambaji White Marble', stoneAr: 'رخام أمباجي الأبيض',    type: 'religious', city: 'Makkah',   stone: 'marble',  img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80' },
  { id: 6, titleEn: 'Government Complex — Riyadh',   titleAr: 'مجمع حكومي — الرياض',       stoneEn: 'Black Galaxy Granite', stoneAr: 'جرانيت البلاك جالاكسي', type: 'government', city: 'Riyadh', stone: 'granite', img: 'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=600&q=80' },
  { id: 7, titleEn: 'Luxury Apartment — Madinah',    titleAr: 'شقة فاخرة — المدينة',       stoneEn: 'Fantasy Brown Marble', stoneAr: 'رخام فانتازي براون',    type: 'residential', city: 'Madinah', stone: 'marble', img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80' },
  { id: 8, titleEn: 'Office Building — Dammam',      titleAr: 'مبنى مكاتب — الدمام',       stoneEn: 'Absolute Black Granite', stoneAr: 'جرانيت الأسود المطلق', type: 'commercial', city: 'Dammam', stone: 'granite', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80' },
  { id: 9, titleEn: 'Resort Pool — Jeddah',          titleAr: 'حوض سباحة منتجع — جدة',    stoneEn: 'Copper Slate',        stoneAr: 'أردواز نحاسي',          type: 'hospitality', city: 'Jeddah', stone: 'slate',   img: 'https://images.unsplash.com/photo-1558618047-f4e80c0d3944?w=600&q=80' },
];

const stoneTypes = ['All', 'slate', 'marble', 'granite'];
const projectTypes = ['All', 'residential', 'commercial', 'hospitality', 'religious', 'landscaping', 'government'];
const cities = ['All', 'Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah'];

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [stoneFilter, setStoneFilter] = useState('All');
  const [typeFilter,  setTypeFilter]  = useState('All');
  const [cityFilter,  setCityFilter]  = useState('All');

  const filtered = projects.filter(p =>
    (stoneFilter === 'All' || p.stone === stoneFilter) &&
    (typeFilter  === 'All' || p.type === typeFilter) &&
    (cityFilter  === 'All' || p.city === cityFilter)
  );

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-[var(--color-obsidian)] text-center overflow-hidden" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=60" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="container-site relative z-10">
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-4">
            {isAr ? 'أعمالنا' : 'Our Work'}
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {t('title')}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-14 bg-[var(--color-marble-white)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { label: t('filter_stone'), values: stoneTypes,    current: stoneFilter, set: setStoneFilter },
              { label: t('filter_type'),  values: projectTypes,   current: typeFilter,  set: setTypeFilter },
              { label: t('filter_city'),  values: cities,         current: cityFilter,  set: setCityFilter },
            ].map(({ label, values, current, set }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-warm-gray)]">{label}:</span>
                <select
                  value={current}
                  onChange={e => set(e.target.value)}
                  className="text-sm border border-[var(--color-sand)] rounded px-3 py-1.5 bg-white text-[var(--color-obsidian)] focus:outline-none focus:border-[var(--color-gold)]"
                >
                  {values.map(v => (
                    <option key={v} value={v}>
                      {v === 'All' ? (isAr ? 'الكل' : 'All') : v}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <span className="ms-auto text-sm text-[var(--color-warm-gray)] self-center">
              {filtered.length} {isAr ? 'مشروع' : 'projects'}
            </span>
          </div>

          {/* Masonry-ish grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map(p => (
              <article key={p.id} className="break-inside-avoid group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-[var(--color-sand)]">
                <div className="relative overflow-hidden">
                  <img
                    src={p.img}
                    alt={isAr ? p.titleAr : p.titleEn}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ height: `${220 + (p.id % 3) * 60}px` }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)]/60 to-transparent" />
                  <span className="absolute top-3 start-3 bg-[var(--color-deep-green)] text-white text-xs px-2.5 py-1 rounded-sm capitalize">
                    {p.stone}
                  </span>
                </div>
                <div className="p-4" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
                  <h3
                    className="font-bold text-[var(--color-obsidian)] mb-1"
                    style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                  >
                    {isAr ? p.titleAr : p.titleEn}
                  </h3>
                  <p className="text-[var(--color-warm-gray)] text-sm">
                    {isAr ? p.stoneAr : p.stoneEn} · {p.city}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[var(--color-warm-gray)]">
              <p>{isAr ? 'لا توجد مشاريع مطابقة' : 'No projects match the selected filters'}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
