import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Phone, Mail, MapPin, Instagram, Twitter, ExternalLink } from 'lucide-react';
import { SocialLinks } from '@/lib/admin-types';

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.89a8.17 8.17 0 0 0 4.83 1.54V7.97a4.85 4.85 0 0 1-1.06-.28z" />
    </svg>
  );
}

function SnapchatIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.484l-.002.029c-.008.093-.014.179-.019.257.096.022.215.045.36.069l.03.006c.619.115 1.554.288 1.556 1.154.003.805-.784 1.072-1.346 1.238l-.06.018c-.3.084-.536.21-.764.397-.651.596-.555 1.793-.387 2.51.434 1.799 3.591 1.727 3.682 3.415-.014.391-.326.813-1.806.873-1.21.049-1.6.406-2.026 1.095l-.016.029a3.6 3.6 0 0 1-.211.306c-.557.734-1.385.756-2.329.434-.682-.233-1.435-.432-2.315-.432-.864 0-1.611.192-2.285.425-.961.331-1.792.309-2.357-.435-.094-.123-.17-.252-.225-.374-.424-.698-.84-1.056-2.049-1.105-1.478-.06-1.79-.481-1.806-.873.091-1.688 3.248-1.616 3.682-3.415.168-.717.264-1.914-.387-2.51-.23-.188-.466-.314-.765-.398l-.059-.018C4.787 10.83 4 10.562 4.003 9.757c.002-.866.937-1.039 1.556-1.154l.03-.006c.145-.024.264-.047.36-.069a5.38 5.38 0 0 1-.02-.257l-.002-.029c-.086-1.265-.212-3.291.317-4.484C7.859 1.069 11.216.793 12.206.793z" />
    </svg>
  );
}

const navLinks = [
  { key: 'home',     href: '/' },
  { key: 'about',    href: '/about' },
  { key: 'products', href: '/products' },
  { key: 'projects', href: '/projects' },
  { key: 'services', href: '/services' },
  { key: 'contact',  href: '/contact' },
];

const productLinks = [
  { nameEn: 'Natural Slate Stone', nameAr: 'حجر الأردواز الطبيعي', href: '/products/natural-slate' },
  { nameEn: 'Marble',              nameAr: 'الرخام',                 href: '/products/marble' },
  { nameEn: 'Granite',             nameAr: 'الجرانيت',               href: '/products/granite' },
];

export default function Footer({ social }: { social?: Partial<SocialLinks> }) {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const showDistributor = tc('exclusive_distributor_visible' as Parameters<typeof tc>[0]) !== 'false';

  return (
    <footer
      className="bg-[var(--color-obsidian)] text-white"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      {/* Gold separator line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />

      {/* Main footer grid */}
      <div className="container-site py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1: Brand */}
        <div className="lg:col-span-1">
          <Link href={`/${locale}`} className="block mb-3">
            <span
              className="text-[var(--color-gold)] font-bold text-xl block"
              style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
            >
              {tc('company_name')}
            </span>
          </Link>
          <p className="text-white/60 text-sm leading-relaxed mb-3">
            {t('description')}
          </p>
          {showDistributor && (
            <p className="text-[var(--color-gold)]/80 text-xs leading-relaxed border border-[var(--color-gold)]/20 rounded px-3 py-2 bg-white/5">
              {t('exclusive_distributor')}
            </p>
          )}
          {/* Social */}
          {(() => {
            const socialItems = [
              { key: 'instagram' as const, icon: <Instagram size={16} />, label: 'Instagram' },
              { key: 'x'         as const, icon: <Twitter   size={16} />, label: 'X'         },
              { key: 'tiktok'    as const, icon: <TikTokIcon size={16} />, label: 'TikTok'   },
              { key: 'snapchat'  as const, icon: <SnapchatIcon size={16} />, label: 'Snapchat' },
            ].filter(({ key }) => social?.[key]);
            return socialItems.length > 0 ? (
              <div className="flex gap-3 mt-5">
                {socialItems.map(({ key, icon, label }) => (
                  <a
                    key={key}
                    href={social![key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            ) : null;
          })()}
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className={`text-white font-semibold text-sm mb-5 pb-2 border-b border-white/10 ${isAr ? '' : 'uppercase tracking-widest'}`}>
            {t('quick_links')}
          </h3>
          <ul className="space-y-2.5">
            {navLinks.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={`/${locale}${href === '/' ? '' : href}`}
                  className="text-white/60 hover:text-[var(--color-gold)] text-sm transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--color-gold)]/40 group-hover:bg-[var(--color-gold)] transition-colors" />
                  {tn(key as 'home')}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Products */}
        <div>
          <h3 className={`text-white font-semibold text-sm mb-5 pb-2 border-b border-white/10 ${isAr ? '' : 'uppercase tracking-widest'}`}>
            {t('our_products')}
          </h3>
          <ul className="space-y-2.5">
            {productLinks.map(({ nameEn, nameAr, href }) => (
              <li key={href}>
                <Link
                  href={`/${locale}${href}`}
                  className="text-white/60 hover:text-[var(--color-gold)] text-sm transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--color-gold)]/40 group-hover:bg-[var(--color-gold)] transition-colors" />
                  {isAr ? nameAr : nameEn}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link
              href={`/${locale}/quote`}
              className="btn-gold text-sm py-2 w-full justify-center"
            >
              {isAr ? 'طلب عرض سعر' : 'Request a Quote'}
            </Link>
          </div>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h3 className={`text-white font-semibold text-sm mb-5 pb-2 border-b border-white/10 ${isAr ? '' : 'uppercase tracking-widest'}`}>
            {t('contact_info')}
          </h3>
          <ul className="space-y-3.5">
            <li className="flex gap-3 items-start">
              <MapPin size={16} className="text-[var(--color-gold)] mt-0.5 shrink-0" />
              <span className="text-white/60 text-sm leading-relaxed">
                {isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
              </span>
            </li>
            <li>
              <a
                href="tel:+966XXXXXXXXX"
                className="flex gap-3 items-center text-white/60 hover:text-[var(--color-gold)] text-sm transition-colors"
              >
                <Phone size={16} className="text-[var(--color-gold)] shrink-0" />
                <span dir="ltr">+966 XX XXX XXXX</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:info@himalayangulfstones.com"
                className="flex gap-3 items-center text-white/60 hover:text-[var(--color-gold)] text-sm transition-colors break-all"
              >
                <Mail size={16} className="text-[var(--color-gold)] shrink-0" />
                info@himalayangulfstones.com
              </a>
            </li>
            <li className="flex gap-3 items-start pt-1">
              <ExternalLink size={16} className="text-[var(--color-gold)] mt-0.5 shrink-0" />
              <span className="text-white/60 text-xs">
                {isAr ? 'الأحد – الخميس: ٨ ص – ٦ م' : 'Sun – Thu: 8:00 AM – 6:00 PM'}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
          <p>{t('copyright')}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-white/70 transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white/70 transition-colors">
              {t('terms')}
            </Link>
            <span>{t('vat')}: XXXXXXXXXXXXXXX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
