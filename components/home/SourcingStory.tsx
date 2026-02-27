import { useTranslations, useLocale } from 'next-intl';

const steps = [
  { key: 'step1' as const, number: '01' },
  { key: 'step2' as const, number: '02' },
  { key: 'step3' as const, number: '03' },
  { key: 'step4' as const, number: '04' },
  { key: 'step5' as const, number: '05' },
];

export default function SourcingStory() {
  const t = useTranslations('sourcing');
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <section
      className="py-20 bg-[var(--color-sand)]"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
              alt={t('title')}
              className="rounded-lg shadow-2xl w-full aspect-[4/3] object-cover"
              loading="lazy"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-5 -end-5 bg-[var(--color-deep-green)] text-white rounded-lg p-5 shadow-xl max-w-[220px]">
              <p
                className="text-3xl font-bold text-[var(--color-gold)]"
                style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
              >
                🇮🇳 → 🇸🇦
              </p>
              <p className="text-sm mt-1 text-white/80">
                {isAr ? 'من الهند إلى المملكة' : 'India to Saudi Arabia'}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div>
            <p className={`text-[var(--color-gold)] text-sm font-semibold mb-3 ${isAr ? '' : 'tracking-widest uppercase'}`}>
              {isAr ? 'قصة المصدر' : 'The Sourcing Story'}
            </p>
            <h2
              className="section-heading mb-3"
              style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
            >
              {t('title')}
            </h2>
            <p className="text-[var(--color-warm-gray)] mb-10 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="space-y-6">
              {steps.map(({ key, number }, i) => (
                <div key={key} className="flex gap-4 items-start group">
                  {/* Number */}
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--color-obsidian)] text-[var(--color-gold)] flex items-center justify-center text-sm font-bold font-mono">
                    {number}
                  </div>
                  {/* Content */}
                  <div className={`flex-1 pb-6 ${i < steps.length - 1 ? 'border-b border-[var(--color-obsidian)]/10' : ''}`}>
                    <h3
                      className="font-bold text-[var(--color-obsidian)] mb-1"
                      style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                    >
                      {t(`${key}` as 'step1')}
                    </h3>
                    <p className="text-[var(--color-warm-gray)] text-sm leading-relaxed">
                      {t(`${key}_desc` as 'step1_desc')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
