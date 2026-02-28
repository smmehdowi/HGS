'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const saudiCities = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Tabuk', 'Abha', 'Khobar', 'Jubail', 'Yanbu', 'Other'];

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', city: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-[var(--color-obsidian)] text-center overflow-hidden" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <img src="https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=1920&q=60" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="container-site relative z-10">
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-4">
            {isAr ? 'تواصل معنا' : 'Get in Touch'}
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {t('title')}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-20 bg-[var(--color-marble-white)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site grid grid-cols-1 lg:grid-cols-5 gap-14">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2
                className="text-2xl font-bold text-[var(--color-obsidian)] mb-6"
                style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
              >
                {t('office_title')}
              </h2>
              <ul className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    content: isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
                    href: undefined,
                  },
                  {
                    icon: Phone,
                    content: '+966 XX XXX XXXX',
                    href: 'tel:+966XXXXXXXXX',
                  },
                  {
                    icon: Mail,
                    content: 'info@himalayangulfstones.com',
                    href: 'mailto:info@himalayangulfstones.com',
                  },
                  {
                    icon: Clock,
                    content: t('hours_value'),
                    href: undefined,
                    note: t('hours_note'),
                  },
                ].map(({ icon: Icon, content, href, note }) => (
                  <li key={content} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-deep-green)]/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[var(--color-deep-green)]" />
                    </div>
                    <div>
                      {href ? (
                        <a href={href} className="text-[var(--color-obsidian)] hover:text-[var(--color-deep-green)] transition-colors font-medium" dir="ltr">
                          {content}
                        </a>
                      ) : (
                        <p className="text-[var(--color-obsidian)] font-medium">{content}</p>
                      )}
                      {note && <p className="text-[var(--color-warm-gray)] text-xs mt-0.5">{note}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp quick link */}
            <a
              href={`https://wa.me/966XXXXXXXXX?text=${encodeURIComponent(isAr ? 'مرحباً، أرغب في الاستفسار عن أحجاركم الطبيعية' : "Hello, I'd like to inquire about your natural stones")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white font-semibold px-5 py-3.5 rounded-lg hover:bg-[#1ebe5b] transition-colors w-fit"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {isAr ? 'تواصل عبر واتساب' : 'Message on WhatsApp'}
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <h2
              className="text-2xl font-bold text-[var(--color-obsidian)] mb-6"
              style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
            >
              {t('form_title')}
            </h2>

            {submitted ? (
              <div className="bg-[var(--color-deep-green)]/10 border border-[var(--color-deep-green)]/30 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-[var(--color-deep-green)] font-semibold text-lg">{t('success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'name',    label: t('name'),       type: 'text',  required: true },
                    { id: 'email',   label: t('email_field'), type: 'email', required: true },
                    { id: 'phone',   label: t('phone_field'), type: 'tel',   required: true },
                    { id: 'company', label: t('company'),    type: 'text',  required: false },
                  ].map(({ id, label, type, required }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">
                        {label} {required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id={id} type={type} required={required}
                        value={form[id as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                        className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] bg-white"
                      />
                    </div>
                  ))}
                </div>

                {/* City dropdown */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">
                    {t('city')}
                  </label>
                  <select
                    id="city"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white"
                  >
                    <option value="">{isAr ? 'اختر مدينتك' : 'Select your city'}</option>
                    {saudiCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">
                    {t('message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message" rows={5} required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] bg-white resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3.5">
                  {t('submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
