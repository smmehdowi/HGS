import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/routing';
import { getTheme } from '@/lib/config-store';
import '../globals.css';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import BackToTop from '@/components/shared/BackToTop';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  const isAr = locale === 'ar';
  return {
    title: {
      default: t('company_name'),
      template: `%s | ${t('company_name')}`,
    },
    description: t('tagline'),
    keywords: isAr
      ? ['حجر أردواز طبيعي السعودية', 'مورد رخام هندي السعودية', 'جرانيت هندي الرياض جدة']
      : ['natural slate stone Saudi Arabia', 'Indian marble supplier Saudi', 'granite importer Riyadh Jeddah'],
    alternates: {
      languages: {
        ar: '/ar',
        en: '/en',
      },
    },
    openGraph: {
      siteName: t('company_name'),
      locale: isAr ? 'ar_SA' : 'en_US',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const BASE_URL = 'https://www.himalayangulfstones.com';

function JsonLd({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const organization = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: isAr ? 'هيمالايان جلف ستونز' : 'Himalayan Gulf Stones',
        alternateName: isAr ? 'Himalayan Gulf Stones' : 'هيمالايان جلف ستونز',
        url: BASE_URL,
        description: isAr
          ? 'الموزع الحصري لشركة The Himalayan Ventures LLC في المملكة العربية السعودية. نستورد أفضل أحجار الأردواز والرخام والجرانيت الهندية مباشرة إلى المملكة.'
          : 'Exclusive distributor of The Himalayan Ventures LLC in Saudi Arabia. We import the finest Indian Slate, Marble, and Granite directly to the Kingdom.',
        email: 'info@himalayangulfstones.com',
        telephone: '+966XXXXXXXXX',
        areaServed: 'SA',
        sameAs: [],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${BASE_URL}/#localbusiness`,
        name: isAr ? 'هيمالايان جلف ستونز' : 'Himalayan Gulf Stones',
        url: BASE_URL,
        telephone: '+966XXXXXXXXX',
        email: 'info@himalayangulfstones.com',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'SA',
          addressRegion: 'Riyadh',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 24.7136, longitude: 46.6753 },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '08:00',
            closes: '18:00',
          },
        ],
        currenciesAccepted: 'SAR',
        priceRange: '$$',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  const [messages, theme] = await Promise.all([getMessages(), getTheme()]);
  const isRtl = locale === 'ar';

  const themeVars = `
    :root {
      --color-obsidian: ${theme.colors.obsidian};
      --color-marble-white: ${theme.colors.marbleWhite};
      --color-gold: ${theme.colors.gold};
      --color-gold-light: ${theme.colors.goldLight};
      --color-warm-gray: ${theme.colors.warmGray};
      --color-slate-dark: ${theme.colors.slateDark};
      --color-sand: ${theme.colors.sand};
      --color-deep-green: ${theme.colors.deepGreen};
      --color-deep-green-hover: ${theme.colors.deepGreenHover};
      --color-slate-blue: ${theme.colors.slateBlue};
      --font-en-heading: '${theme.fonts.enHeading}', Georgia, serif;
      --font-en-body: '${theme.fonts.enBody}', system-ui, sans-serif;
      --font-ar-heading: '${theme.fonts.arHeading}', 'Arabic Typesetting', sans-serif;
      --font-ar-body: '${theme.fonts.arBody}', 'Arabic Typesetting', sans-serif;
      --font-size-hero-en: ${theme.fontSizes?.heroEn ?? '4.5rem'};
      --font-size-hero-ar: ${theme.fontSizes?.heroAr ?? '4rem'};
      --font-size-h2-en: ${theme.fontSizes?.h2En ?? '2rem'};
      --font-size-h2-ar: ${theme.fontSizes?.h2Ar ?? '1.85rem'};
      --font-size-body-en: ${theme.fontSizes?.bodyEn ?? '1rem'};
      --font-size-body-ar: ${theme.fontSizes?.bodyAr ?? '1.1rem'};
    }
  `;

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <head>
        {/* Theme CSS vars — injected first so they're available immediately */}
        <style dangerouslySetInnerHTML={{ __html: themeVars }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Explicit font load — all Arabic + English fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Tajawal:wght@300;400;500;700;800&family=Cairo:wght@300;400;500;600;700;800&family=Almarai:wght@300;400;700;800&display=swap"
        />
        <link rel="alternate" hrefLang="ar" href={`${BASE_URL}/ar`} />
        <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/ar`} />
        <JsonLd locale={locale} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          <main>{children}</main>
          <Footer social={theme.social} />
          <WhatsAppButton />
          <BackToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
