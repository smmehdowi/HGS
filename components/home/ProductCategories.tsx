import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const categories = [
  {
    key: 'slate' as const,
    href: '/products/natural-slate',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    color: '#3a3a3c',
  },
  {
    key: 'marble' as const,
    href: '/products/marble',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80',
    color: '#8a8279',
  },
  {
    key: 'granite' as const,
    href: '/products/granite',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    color: '#1a1a1a',
  },
];

export default function ProductCategories() {
  const t = useTranslations('products');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section
      id="products"
      className="py-20 bg-[var(--color-marble-white)]"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div className="container-site">
        {/* Section Header */}
        <div className={`mb-12 ${isAr ? 'text-right' : 'text-left'}`}>
          <p className={`text-[var(--color-gold)] text-sm font-semibold mb-3 ${isAr ? '' : 'tracking-widest uppercase'}`}>
            {isAr ? 'مجموعاتنا' : 'Our Collections'}
          </p>
          <h2
            className="section-heading mb-4"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[var(--color-warm-gray)] max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(({ key, href, image }) => (
            <Link
              key={key}
              href={`/${locale}${href}`}
              className="group relative overflow-hidden rounded-lg shadow-md aspect-[4/5] flex flex-col justify-end"
              aria-label={t(`${key}.name`)}
            >
              {/* Background image */}
              <img
                src={image}
                alt={t(`${key}.name`)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)] via-[var(--color-obsidian)]/20 to-transparent" />
              {/* Gold border on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-gold)] transition-all duration-300 rounded-lg" />

              {/* Content */}
              <div className="relative z-10 p-6">
                <p className={`text-[var(--color-gold)] text-xs font-medium mb-1 ${isAr ? '' : 'tracking-widest uppercase'}`}>
                  {t(`${key}.count`)}
                </p>
                <h3
                  className="text-white text-2xl font-bold mb-2"
                  style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                >
                  {t(`${key}.name`)}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {t(`${key}.description`)}
                </p>
                <span className="inline-flex items-center gap-2 text-[var(--color-gold)] text-sm font-semibold group-hover:gap-3 transition-all">
                  {t('view_all')}
                  <Arrow size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
