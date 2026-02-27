import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('not_found');
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[var(--color-marble-white)] text-center px-6"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div>
        <p
          className="text-8xl font-bold text-[var(--color-gold)] mb-4"
          style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
        >
          404
        </p>
        <h1
          className="text-3xl font-bold text-[var(--color-obsidian)] mb-3"
          style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
        >
          {t('title')}
        </h1>
        <p className="text-[var(--color-warm-gray)] mb-8">{t('body')}</p>
        <Link href={`/${locale}`} className="btn-primary">
          {t('back_home')}
        </Link>
      </div>
    </div>
  );
}
