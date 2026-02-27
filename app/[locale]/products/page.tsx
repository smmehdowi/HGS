import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return { title: t('title'), description: t('subtitle') };
}

const categories = [
  {
    key: 'slate' as const,
    href: '/products/natural-slate',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    key: 'marble' as const,
    href: '/products/marble',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80',
  },
  {
    key: 'granite' as const,
    href: '/products/granite',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
  },
];

export default function ProductsPage() {
  const t = useTranslations('products');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-16 bg-[var(--color-obsidian)] text-center overflow-hidden"
        style={{ direction: isAr ? 'rtl' : 'ltr' }}
      >
        <img
          src="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1920&q=60"
          alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="container-site relative z-10">
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-4">
            {isAr ? 'مجموعاتنا' : 'Our Collections'}
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

      {/* Categories */}
      <section className="py-20 bg-[var(--color-marble-white)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map(({ key, href, image }) => (
            <Link
              key={key}
              href={`/${locale}${href}`}
              className="group relative rounded-xl overflow-hidden shadow-md aspect-[3/4] flex flex-col justify-end"
            >
              <img
                src={image}
                alt={t(`${key}.name`)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)] via-[var(--color-obsidian)]/10 to-transparent" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-gold)] transition-all duration-300 rounded-xl" />
              <div className="relative z-10 p-7">
                <p className="text-[var(--color-gold)] text-xs font-medium tracking-widest uppercase mb-1">
                  {t(`${key}.count`)}
                </p>
                <h2
                  className="text-white text-3xl font-bold mb-3"
                  style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                >
                  {t(`${key}.name`)}
                </h2>
                <p className="text-white/70 text-sm mb-5 leading-relaxed">{t(`${key}.description`)}</p>
                <span className="inline-flex items-center gap-2 text-[var(--color-gold)] font-semibold group-hover:gap-3 transition-all">
                  {t('view_all')} <Arrow size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
