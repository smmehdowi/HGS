import { useTranslations, useLocale } from 'next-intl';
import { Truck, Gem, Scissors, Award } from 'lucide-react';

const features = [
  { key: 'direct_import' as const,   icon: Gem    },
  { key: 'saudi_delivery' as const,  icon: Truck  },
  { key: 'custom_cutting' as const,  icon: Scissors },
  { key: 'quality' as const,         icon: Award  },
];

export default function WhyChooseUs() {
  const t = useTranslations('why_us');
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <section
      className="py-20 bg-[var(--color-obsidian)] relative overflow-hidden"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      {/* Islamic geometric background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        {/* Header */}
        <div className={`mb-14 max-w-2xl ${isAr ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
          <p className={`text-[var(--color-gold)] text-sm font-semibold mb-3 ${isAr ? '' : 'tracking-widest uppercase'}`}>
            {isAr ? 'لماذا نحن' : 'Why Choose Us'}
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {t('title')}
          </h2>
          <p className="text-white/60 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className={`group p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[var(--color-gold)]/40 transition-all duration-300 ${isAr ? 'text-right' : 'text-left'}`}
            >
              <div className={`w-12 h-12 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center mb-5 group-hover:bg-[var(--color-gold)]/20 transition-colors ${isAr ? 'ml-auto' : 'mr-auto'}`}>
                <Icon size={22} className="text-[var(--color-gold)]" />
              </div>
              <h3
                className="text-white font-bold text-lg mb-3"
                style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
              >
                {t(`${key}` as 'direct_import')}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {t(`${key}_desc` as 'direct_import_desc')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
