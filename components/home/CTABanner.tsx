import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function CTABanner() {
  const t = useTranslations('cta_banner');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--color-deep-green)]" />
      <img
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=60"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
      />
      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10 text-center">
        <p className={`text-[var(--color-gold)] text-sm font-semibold mb-4 ${isAr ? '' : 'tracking-widest uppercase'}`}>
          {isAr ? 'ابدأ مشروعك' : 'Start Your Project'}
        </p>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 max-w-2xl mx-auto leading-tight"
          style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
        >
          {t('title')}
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          {t('subtitle')}
        </p>
        <Link
          href={`/${locale}/quote`}
          className="btn-gold text-base px-10 py-4 inline-flex items-center gap-2"
        >
          {t('button')}
          <Arrow size={18} />
        </Link>
      </div>
    </section>
  );
}
