'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');
  const tc = useTranslations('common');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const bgImage = t('background_image' as Parameters<typeof t>[0])
    || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85';
  const showDistributor = t('exclusive_distributor_visible' as Parameters<typeof t>[0]) !== 'false';

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label={isAr ? 'القسم الرئيسي' : 'Hero section'}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-obsidian)]/80 via-[var(--color-obsidian)]/60 to-[var(--color-obsidian)]/80" />
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Gold accent line — top */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent z-10" />

      {/* Content */}
      <div className="relative z-10 container-site text-center py-32" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
          <span className={`text-[var(--color-gold)] text-xs font-medium ${isAr ? '' : 'tracking-widest uppercase'}`}>
            {tc('company_name')}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-bold text-white mb-6 leading-tight"
          style={{
            fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)',
            fontSize: isAr ? 'var(--font-size-hero-ar)' : 'var(--font-size-hero-en)',
          }}
        >
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: isAr ? 'var(--font-size-body-ar)' : 'var(--font-size-body-en)' }}
        >
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isAr ? 'sm:flex-row-reverse' : ''}`}>
          <Link href={`/${locale}/products`} className="btn-gold text-base px-8 py-3.5 justify-center">
            {t('cta_primary')}
          </Link>
          <Link href={`/${locale}/quote`} className="btn-outline text-base px-8 py-3.5 justify-center">
            {t('cta_secondary')}
          </Link>
        </div>

        {/* Exclusive distributor badge */}
        {showDistributor && (
          <div className="mt-14 inline-flex items-center gap-3 text-white/40 text-sm">
            <div className="w-8 h-px bg-white/20" />
            <span>{t('exclusive_distributor')}</span>
            <div className="w-8 h-px bg-white/20" />
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center z-10">
        <a
          href="#products"
          aria-label={t('scroll_down')}
          className="flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors group"
        >
          <span className={`text-xs ${isAr ? '' : 'tracking-widest uppercase'}`}>{t('scroll_down')}</span>
          <ChevronDown size={18} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
