import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Ship, Scissors, Layers, Truck, MessageCircle, Package, FlaskConical } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });
  return { title: t('title'), description: t('subtitle') };
}

const services = [
  { key: 'import',       icon: Ship,          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80' },
  { key: 'cutting',      icon: Scissors,      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80' },
  { key: 'finishing',    icon: Layers,        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { key: 'delivery',     icon: Truck,         image: 'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=600&q=80' },
  { key: 'consultation', icon: MessageCircle, image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&q=80' },
  { key: 'wholesale',    icon: Package,       image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80' },
  { key: 'samples',      icon: FlaskConical,  image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80' },
] as const;

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-[var(--color-obsidian)] text-center overflow-hidden" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=60" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="container-site relative z-10">
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-4">
            {isAr ? 'ما نقدمه' : 'What We Offer'}
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

      {/* Services Grid */}
      <section className="py-20 bg-[var(--color-marble-white)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(({ key, icon: Icon, image }) => (
            <article key={key} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--color-sand)] hover:border-[var(--color-gold)]/30">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img src={image} alt="" aria-hidden className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-[var(--color-obsidian)]/40" />
                <div className="absolute bottom-4 start-4 w-12 h-12 rounded-lg bg-[var(--color-deep-green)] flex items-center justify-center">
                  <Icon size={22} className="text-white" />
                </div>
              </div>
              {/* Content */}
              <div className="p-6">
                <h2
                  className="font-bold text-[var(--color-obsidian)] text-xl mb-3"
                  style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                >
                  {t(`${key}_title` as 'import_title')}
                </h2>
                <p className="text-[var(--color-warm-gray)] text-sm leading-relaxed">
                  {t(`${key}_desc` as 'import_desc')}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--color-sand)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site text-center">
          <h2 className="section-heading mb-4" style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}>
            {isAr ? 'هل تحتاج خدمة مخصصة؟' : 'Need a Custom Service?'}
          </h2>
          <p className="text-[var(--color-warm-gray)] mb-8 max-w-lg mx-auto">
            {isAr ? 'تواصل معنا لمناقشة متطلباتك المحددة — نحن هنا للمساعدة' : "Contact us to discuss your specific requirements — we're here to help"}
          </p>
          <Link href={`/${locale}/contact`} className="btn-primary px-10">
            {isAr ? 'اتصل بنا' : 'Get in Touch'}
          </Link>
        </div>
      </section>
    </>
  );
}
