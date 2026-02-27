import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { CheckCircle, Star, Shield } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), description: t('subtitle') };
}

const processSteps = [
  { en: 'Quarry Selection',          ar: 'اختيار المحجر' },
  { en: 'Quality Inspection',        ar: 'فحص الجودة' },
  { en: 'Processing & Cutting',      ar: 'التصنيع والقص' },
  { en: 'Containerized Shipping',    ar: 'الشحن بالحاويات' },
  { en: 'KSA Customs Clearance',     ar: 'الجمارك السعودية' },
  { en: 'Saudi-Wide Delivery',       ar: 'التوصيل داخل المملكة' },
];

export default function AboutPage() {
  const t = useTranslations('about');
  const tc = useTranslations('common');
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 bg-[var(--color-obsidian)] overflow-hidden"
        style={{ direction: isAr ? 'rtl' : 'ltr' }}
      >
        <img
          src="https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=1920&q=60"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="container-site relative z-10 text-center">
          <p className={`text-[var(--color-gold)] text-sm font-semibold mb-4 ${isAr ? '' : 'tracking-widest uppercase'}`}>
            {isAr ? 'من نحن' : 'About Us'}
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {t('title')}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-20 bg-[var(--color-marble-white)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2
              className="section-heading mb-5"
              style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
            >
              {t('story_title')}
            </h2>
            <p className="text-[var(--color-warm-gray)] leading-relaxed mb-6">{t('story_body')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              {[
                { title: t('mission_title'), body: t('mission_body'), icon: Star },
                { title: t('vision_title'),  body: t('vision_body'),  icon: CheckCircle },
              ].map(({ title, body, icon: Icon }) => (
                <div key={title} className="bg-[var(--color-sand)] rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={18} className="text-[var(--color-deep-green)]" />
                    <h3
                      className="font-bold text-[var(--color-obsidian)]"
                      style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                    >
                      {title}
                    </h3>
                  </div>
                  <p className="text-[var(--color-warm-gray)] text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80"
              alt={t('story_title')}
              className="rounded-lg shadow-xl w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Exclusive Distributor Section */}
      <section
        className="py-20 bg-[var(--color-obsidian)] relative overflow-hidden"
        style={{ direction: isAr ? 'rtl' : 'ltr' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a96e' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        <div className="container-site relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 rounded-full px-5 py-2 mb-8">
              <Shield size={16} className="text-[var(--color-gold)]" />
              <span className={`text-[var(--color-gold)] text-sm font-semibold ${isAr ? '' : 'tracking-wide'}`}>
                {t('distributor_badge')}
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
            >
              {t('distributor_title')}
            </h2>

            <p className="text-white/70 leading-relaxed text-lg mb-10">{t('distributor_body')}</p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-start">
              {[
                { en: 'Guaranteed Authenticity', ar: 'أصالة مضمونة', desc_en: 'Stones directly from certified Indian quarries', desc_ar: 'أحجار مباشرة من محاجر هندية معتمدة' },
                { en: 'Competitive Pricing',     ar: 'أسعار تنافسية',  desc_en: 'Direct sourcing eliminates middlemen costs',   desc_ar: 'الاستيراد المباشر يلغي تكاليف الوسطاء' },
                { en: 'Priority Supply',         ar: 'أولوية التوريد', desc_en: 'First access to new quarry arrivals',           desc_ar: 'أولوية الوصول إلى وافدات المحاجر الجديدة' },
              ].map(({ en, ar, desc_en, desc_ar }) => (
                <div key={en} className="bg-white/5 border border-white/10 rounded-lg p-5">
                  <CheckCircle size={20} className="text-[var(--color-gold)] mb-3" />
                  <h3
                    className="text-white font-bold mb-2"
                    style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                  >
                    {isAr ? ar : en}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {isAr ? desc_ar : desc_en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Process */}
      <section className="py-20 bg-[var(--color-sand)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site">
          <div className="text-center mb-14">
            <p className={`text-[var(--color-gold)] text-sm font-semibold mb-3 ${isAr ? '' : 'tracking-widest uppercase'}`}>
              {isAr ? 'كيف نعمل' : 'How We Work'}
            </p>
            <h2
              className="section-heading"
              style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
            >
              {t('process_title')}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--color-deep-green)] text-white flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <p
                  className="text-[var(--color-obsidian)] font-semibold text-sm"
                  style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                >
                  {isAr ? step.ar : step.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--color-marble-white)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site text-center">
          <h2
            className="section-heading mb-5"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {isAr ? 'مستعد للبدء؟' : 'Ready to Get Started?'}
          </h2>
          <p className="text-[var(--color-warm-gray)] mb-8 max-w-xl mx-auto">
            {isAr
              ? 'تواصل مع فريقنا لمناقشة متطلبات مشروعك'
              : "Get in touch with our team to discuss your project's stone requirements"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/quote`} className="btn-primary px-8">
              {tc('request_quote')}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-gold px-8">
              {isAr ? 'اتصل بنا' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
