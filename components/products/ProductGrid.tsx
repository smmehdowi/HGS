'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Filter, X } from 'lucide-react';
import type { StoneProduct } from '@/data/types';
import ProductCard from './ProductCard';

type Props = {
  products: StoneProduct[];
  titleEn: string;
  titleAr: string;
  heroImage: string;
  descEn: string;
  descAr: string;
};

export default function ProductGrid({ products, titleEn, titleAr, heroImage, descEn, descAr }: Props) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [colorFilter, setColorFilter]  = useState<string>('');
  const [finishFilter, setFinishFilter] = useState<string>('');
  const [appFilter, setAppFilter]       = useState<string>('');

  const allColors      = useMemo(() => [...new Set(products.flatMap(p => p.colors))].sort(), [products]);
  const allFinishes    = useMemo(() => [...new Set(products.flatMap(p => p.finishes))].sort(), [products]);
  const allApplications = useMemo(() => [...new Set(products.flatMap(p => p.applications))].sort(), [products]);

  const filtered = useMemo(() => products.filter(p =>
    (!colorFilter  || p.colors.includes(colorFilter)) &&
    (!finishFilter || p.finishes.includes(finishFilter)) &&
    (!appFilter    || p.applications.includes(appFilter))
  ), [products, colorFilter, finishFilter, appFilter]);

  const hasFilters = !!(colorFilter || finishFilter || appFilter);

  return (
    <>
      {/* Hero banner */}
      <section className="relative pt-32 pb-20 bg-[var(--color-obsidian)] overflow-hidden" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <img src={heroImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="container-site relative z-10">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {isAr ? titleAr : titleEn}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            {isAr ? descAr : descEn}
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-14 bg-[var(--color-marble-white)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-10 items-center">
            <div className="flex items-center gap-2 text-[var(--color-warm-gray)] text-sm me-2">
              <Filter size={16} />
              <span>{isAr ? 'تصفية:' : 'Filter:'}</span>
            </div>

            {/* Color */}
            <select
              value={colorFilter}
              onChange={e => setColorFilter(e.target.value)}
              className="text-sm border border-[var(--color-sand)] rounded px-3 py-1.5 bg-white text-[var(--color-obsidian)] focus:outline-none focus:border-[var(--color-gold)]"
              aria-label={isAr ? 'اللون' : 'Color'}
            >
              <option value="">{isAr ? 'كل الألوان' : 'All Colors'}</option>
              {allColors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Finish */}
            <select
              value={finishFilter}
              onChange={e => setFinishFilter(e.target.value)}
              className="text-sm border border-[var(--color-sand)] rounded px-3 py-1.5 bg-white text-[var(--color-obsidian)] focus:outline-none focus:border-[var(--color-gold)]"
              aria-label={isAr ? 'التشطيب' : 'Finish'}
            >
              <option value="">{isAr ? 'كل التشطيبات' : 'All Finishes'}</option>
              {allFinishes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            {/* Application */}
            <select
              value={appFilter}
              onChange={e => setAppFilter(e.target.value)}
              className="text-sm border border-[var(--color-sand)] rounded px-3 py-1.5 bg-white text-[var(--color-obsidian)] focus:outline-none focus:border-[var(--color-gold)]"
              aria-label={isAr ? 'الاستخدام' : 'Application'}
            >
              <option value="">{isAr ? 'كل الاستخدامات' : 'All Applications'}</option>
              {allApplications.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={() => { setColorFilter(''); setFinishFilter(''); setAppFilter(''); }}
                className="flex items-center gap-1 text-sm text-[var(--color-warm-gray)] hover:text-[var(--color-obsidian)] transition-colors"
              >
                <X size={14} />
                {isAr ? 'مسح الفلاتر' : 'Clear filters'}
              </button>
            )}

            <span className="ms-auto text-sm text-[var(--color-warm-gray)]">
              {filtered.length} {isAr ? 'نوع' : 'varieties'}
            </span>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[var(--color-warm-gray)]">
              <p className="text-lg">{isAr ? 'لا توجد نتائج للفلاتر المحددة' : 'No products match the selected filters'}</p>
              <button
                onClick={() => { setColorFilter(''); setFinishFilter(''); setAppFilter(''); }}
                className="mt-4 text-[var(--color-deep-green)] underline text-sm"
              >
                {isAr ? 'مسح الفلاتر' : 'Clear filters'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
