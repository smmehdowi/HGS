'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const statKeys = ['years', 'projects', 'varieties', 'tons'] as const;

function useCounter(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target <= 0) return;
    let start = 0;
    const duration = 1600;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(start); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);
  return count;
}

function StatCard({ statKey }: { statKey: typeof statKeys[number] }) {
  const t = useTranslations('stats');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Values come from the editable content config (stats.years_value, stats.projects_value, etc.)
  const value = parseInt(t(`${statKey}_value` as Parameters<typeof t>[0])) || 0;
  const suffix = t(`${statKey}_suffix` as Parameters<typeof t>[0]);
  const count = useCounter(value, active);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center p-6" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
      <p
        className="text-5xl font-bold text-[var(--color-gold)] mb-2"
        style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
      >
        {count.toLocaleString(isAr ? 'ar-SA' : 'en-US')}{suffix}
      </p>
      <p className="text-white/60 text-sm">
        {t(statKey as Parameters<typeof t>[0])}
      </p>
    </div>
  );
}

export default function Statistics() {
  const t = useTranslations('stats');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const bgImage = t('background_image' as Parameters<typeof t>[0]);

  return (
    <section
      className="py-20 bg-[var(--color-obsidian)] relative"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img src={bgImage} alt="" className="w-full h-full object-cover opacity-10" />
      </div>
      <div className="container-site relative z-10">
        <h2
          className="text-center text-2xl sm:text-3xl font-bold text-white mb-12"
          style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
        >
          {t('title')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-x divide-y lg:divide-y-0 divide-white/10">
          {statKeys.map((key) => (
            <StatCard key={key} statKey={key} />
          ))}
        </div>
      </div>
    </section>
  );
}
