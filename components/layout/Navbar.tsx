'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, ChevronDown, ShoppingBag } from 'lucide-react';
import { useQuoteCart } from '@/lib/quote-cart-context';

const navLinks = [
  { key: 'home',     href: '/' },
  { key: 'about',    href: '/about' },
  { key: 'products', href: '/products' },
  { key: 'projects', href: '/projects' },
  { key: 'services', href: '/services' },
  { key: 'contact',  href: '/contact' },
];

export default function Navbar() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { items: cartItems } = useQuoteCart();
  const cartCount = cartItems.length;
  const isRtl = locale === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Strip locale prefix to get the path segment
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '') || '/';

  function localePath(lang: string) {
    return `/${lang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  }

  function isActive(href: string) {
    if (href === '/') return pathWithoutLocale === '/';
    return pathWithoutLocale.startsWith(href);
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--color-obsidian)]/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div
          className="container-site flex items-center justify-between py-4"
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex flex-col leading-none group"
            aria-label={tc('company_name')}
          >
            <span
              className="text-[var(--color-gold)] font-bold text-lg"
              style={{
                fontFamily: isRtl ? 'var(--font-ar-heading)' : 'var(--font-en-heading)',
                letterSpacing: isRtl ? '0' : '0.025em',
              }}
            >
              {tc('company_name')}
            </span>
            <span
              className="text-white/50 text-xs mt-0.5"
              style={{
                letterSpacing: isRtl ? '0' : '0.1em',
                textTransform: isRtl ? 'none' : 'uppercase',
                fontFamily: isRtl ? 'var(--font-ar-body)' : undefined,
              }}
            >
              {tc('navbar_tagline' as Parameters<typeof tc>[0])}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={`/${locale}${href === '/' ? '' : href}`}
                className={`px-3 py-2 rounded-sm transition-colors relative ${
                  isActive(href)
                    ? 'text-[var(--color-gold)]'
                    : 'text-white/80 hover:text-white'
                }`}
                style={{
                  fontFamily: isRtl ? 'var(--font-ar-body)' : 'var(--font-en-body)',
                  fontSize: isRtl ? '1.05rem' : '0.875rem',
                  fontWeight: isRtl ? 600 : 500,
                }}
                aria-current={isActive(href) ? 'page' : undefined}
              >
                {t(key as keyof typeof t)}
                {isActive(href) && (
                  <span className="absolute bottom-0 inset-x-3 h-0.5 bg-[var(--color-deep-green)] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side: Lang switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium px-2 py-1.5 rounded-sm transition-colors"
                aria-haspopup="true"
                aria-expanded={langOpen}
              >
                <Globe size={15} />
                <span>{locale === 'ar' ? 'العربية' : 'English'}</span>
                <ChevronDown size={13} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-1 end-0 bg-[var(--color-obsidian)] border border-white/10 rounded shadow-xl min-w-[120px] overflow-hidden">
                  {(['ar', 'en'] as const).map((lang) => (
                    <Link
                      key={lang}
                      href={localePath(lang)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        locale === lang
                          ? 'text-[var(--color-gold)] bg-white/5'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => setLangOpen(false)}
                      hrefLang={lang}
                    >
                      {lang === 'ar' ? 'العربية' : 'English'}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* CTA — Quote with cart badge */}
            <Link
              href={`/${locale}/quote`}
              className="btn-primary text-sm py-2 px-4 flex items-center gap-2 relative"
            >
              <ShoppingBag size={15} />
              {t('quote')}
              {cartCount > 0 && (
                <span className="absolute -top-2 -end-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: Lang + Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href={localePath(locale === 'ar' ? 'en' : 'ar')}
              className="text-white/70 hover:text-white text-sm flex items-center gap-1 px-2 py-1"
              hrefLang={locale === 'ar' ? 'en' : 'ar'}
            >
              <Globe size={14} />
              <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-1.5"
              aria-label={tc(menuOpen ? 'close' : 'menu')}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-obsidian)] flex flex-col transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="pt-20 px-6 flex flex-col gap-1">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={`/${locale}${href === '/' ? '' : href}`}
              className={`font-semibold py-3 border-b border-white/10 transition-colors ${
                isActive(href) ? 'text-[var(--color-gold)]' : 'text-white'
              }`}
              style={{
                fontFamily: isRtl ? 'var(--font-ar-body)' : 'var(--font-en-heading)',
                fontSize: isRtl ? '1.35rem' : '1.25rem',
              }}
              aria-current={isActive(href) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {t(key as keyof typeof t)}
            </Link>
          ))}
          <Link
            href={`/${locale}/quote`}
            className="btn-primary mt-6 justify-center text-center flex items-center gap-2"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingBag size={15} />
            {t('quote')}
            {cartCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none ms-1">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
