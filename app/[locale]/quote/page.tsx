'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle } from 'lucide-react';

// value = what gets submitted; labelKey = translation key for display
const stoneTypes = [
  { value: 'slate',   labelKey: 'stone_slate' },
  { value: 'marble',  labelKey: 'stone_marble' },
  { value: 'granite', labelKey: 'stone_granite' },
] as const;

const finishTypes = [
  { value: 'Natural Cleft',  labelKey: 'finish_natural_cleft' },
  { value: 'Polished',       labelKey: 'finish_polished' },
  { value: 'Honed',          labelKey: 'finish_honed' },
  { value: 'Flamed',         labelKey: 'finish_flamed' },
  { value: 'Brushed',        labelKey: 'finish_brushed' },
  { value: 'Sandblasted',    labelKey: 'finish_sandblasted' },
  { value: 'Leathered',      labelKey: 'finish_leathered' },
  { value: 'Calibrated',     labelKey: 'finish_calibrated' },
] as const;

const projectTypes = [
  { value: 'Residential Villa',    labelKey: 'project_residential' },
  { value: 'Apartment',            labelKey: 'project_apartment' },
  { value: 'Commercial Building',  labelKey: 'project_commercial' },
  { value: 'Hotel / Hospitality',  labelKey: 'project_hotel' },
  { value: 'Mosque / Religious',   labelKey: 'project_mosque' },
  { value: 'Government',           labelKey: 'project_government' },
  { value: 'Landscaping',          labelKey: 'project_landscaping' },
  { value: 'Other',                labelKey: 'project_other' },
] as const;

const saudiCities = [
  { value: 'Riyadh',  labelKey: 'city_riyadh' },
  { value: 'Jeddah',  labelKey: 'city_jeddah' },
  { value: 'Dammam',  labelKey: 'city_dammam' },
  { value: 'Makkah',  labelKey: 'city_makkah' },
  { value: 'Madinah', labelKey: 'city_madinah' },
  { value: 'Tabuk',   labelKey: 'city_tabuk' },
  { value: 'Abha',    labelKey: 'city_abha' },
  { value: 'Khobar',  labelKey: 'city_khobar' },
  { value: 'Jubail',  labelKey: 'city_jubail' },
  { value: 'Yanbu',   labelKey: 'city_yanbu' },
  { value: 'Other',   labelKey: 'city_other' },
] as const;

type Step = 1 | 2 | 3 | 4;

const stoneImages: Record<string, string> = {
  slate:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  marble:  'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&q=80',
  granite: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
};

export default function QuotePage() {
  const t = useTranslations('quote');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  const [stoneType, setStoneType]       = useState('');
  const [variety, setVariety]           = useState('');
  const [quantity, setQuantity]         = useState('');
  const [dimensions, setDimensions]     = useState('');
  const [thickness, setThickness]       = useState('');
  const [finish, setFinish]             = useState('');
  const [projectType, setProjectType]   = useState('');
  const [city, setCity]                 = useState('');
  const [timeline, setTimeline]         = useState('');
  const [name, setName]                 = useState('');
  const [company, setCompany]           = useState('');
  const [phone, setPhone]               = useState('');
  const [email, setEmail]               = useState('');
  const [contactMethod, setContactMethod] = useState('whatsapp');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const steps: { num: Step; label: string }[] = [
    { num: 1, label: t('step1_title') },
    { num: 2, label: t('step2_title') },
    { num: 3, label: t('step3_title') },
    { num: 4, label: t('step4_title') },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-marble-white)] pt-24">
        <div className="text-center max-w-md mx-auto px-6">
          <CheckCircle size={64} className="text-[var(--color-deep-green)] mx-auto mb-6" />
          <h1
            className="text-3xl font-bold text-[var(--color-obsidian)] mb-4"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {t('success_title')}
          </h1>
          <p className="text-[var(--color-warm-gray)] leading-relaxed">{t('success')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-10 bg-[var(--color-obsidian)] text-center overflow-hidden" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <img src="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1920&q=60" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="container-site relative z-10">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
          >
            {t('title')}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-14 bg-[var(--color-marble-white)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <div className="container-site max-w-3xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            {steps.map(({ num, label }, i) => (
              <div key={num} className="flex items-center gap-2 shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= num ? 'bg-[var(--color-deep-green)] text-white' : 'bg-[var(--color-sand)] text-[var(--color-warm-gray)]'}`}>
                  {step > num ? '✓' : num}
                </div>
                <span className={`text-sm hidden sm:block ${step === num ? 'text-[var(--color-obsidian)] font-semibold' : 'text-[var(--color-warm-gray)]'}`}>
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${step > num ? 'bg-[var(--color-deep-green)]' : 'bg-[var(--color-sand)]'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[var(--color-sand)] p-8">

            {/* Step 1 — Stone Type */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-obsidian)] mb-6" style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}>
                  {t('step1_title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                  {stoneTypes.map(({ value, labelKey }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStoneType(value)}
                      className={`rounded-lg overflow-hidden border-2 transition-all ${stoneType === value ? 'border-[var(--color-deep-green)] shadow-md' : 'border-[var(--color-sand)] hover:border-[var(--color-warm-gray)]'}`}
                    >
                      <img src={stoneImages[value]} alt={t(labelKey as Parameters<typeof t>[0])} className="w-full h-32 object-cover" />
                      <div className="p-3 text-center">
                        <span className="font-semibold text-[var(--color-obsidian)] text-sm">{t(labelKey as Parameters<typeof t>[0])}</span>
                        {stoneType === value && <div className="mt-1 w-4 h-4 rounded-full bg-[var(--color-deep-green)] mx-auto flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
                      </div>
                    </button>
                  ))}
                </div>
                <div>
                  <label htmlFor="variety" className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">{t('variety')}</label>
                  <input id="variety" type="text" value={variety} onChange={e => setVariety(e.target.value)}
                    placeholder={isAr ? 'مثل: رخام ماكرانا، جرانيت بلاك جالاكسي' : 'e.g. Makrana White Marble, Black Galaxy Granite'}
                    className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white" />
                </div>
                <div className="flex justify-end mt-8">
                  <button type="button" disabled={!stoneType} onClick={() => setStep(2)} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    {t('next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Specifications */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-obsidian)] mb-6" style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}>
                  {t('step2_title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">{t('quantity')} <span className="text-red-500">*</span></label>
                    <input type="number" required value={quantity} onChange={e => setQuantity(e.target.value)} min="1" className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">{t('dimensions')}</label>
                    <input type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="e.g. 60x60cm" className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">{t('thickness')}</label>
                    <input type="text" value={thickness} onChange={e => setThickness(e.target.value)} placeholder="e.g. 20mm" className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">{t('finish')}</label>
                    <select value={finish} onChange={e => setFinish(e.target.value)} className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white">
                      <option value="">{t('select_finish')}</option>
                      {finishTypes.map(({ value, labelKey }) => <option key={value} value={value}>{t(labelKey as Parameters<typeof t>[0])}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline !text-[var(--color-obsidian)] !border-[var(--color-sand)] hover:!bg-[var(--color-sand)]">{t('back')}</button>
                  <button type="button" disabled={!quantity} onClick={() => setStep(3)} className="btn-primary disabled:opacity-40">{t('next')}</button>
                </div>
              </div>
            )}

            {/* Step 3 — Project Details */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-obsidian)] mb-6" style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}>
                  {t('step3_title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">{t('project_type')}</label>
                    <select value={projectType} onChange={e => setProjectType(e.target.value)} className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white">
                      <option value="">{t('select_type')}</option>
                      {projectTypes.map(({ value, labelKey }) => <option key={value} value={value}>{t(labelKey as Parameters<typeof t>[0])}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">{t('city')} <span className="text-red-500">*</span></label>
                    <select required value={city} onChange={e => setCity(e.target.value)} className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white">
                      <option value="">{t('select_city')}</option>
                      {saudiCities.map(({ value, labelKey }) => <option key={value} value={value}>{t(labelKey as Parameters<typeof t>[0])}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">{t('timeline')}</label>
                    <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} placeholder={isAr ? 'مثل: ٣ أشهر، يناير ٢٠٢٦' : 'e.g. 3 months, January 2026'} className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white" />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button type="button" onClick={() => setStep(2)} className="btn-outline !text-[var(--color-obsidian)] !border-[var(--color-sand)] hover:!bg-[var(--color-sand)]">{t('back')}</button>
                  <button type="button" disabled={!city} onClick={() => setStep(4)} className="btn-primary disabled:opacity-40">{t('next')}</button>
                </div>
              </div>
            )}

            {/* Step 4 — Contact Info */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--color-obsidian)] mb-6" style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}>
                  {t('step4_title')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: 'name',    label: t('name'),    value: name,    set: setName,    type: 'text',  req: true },
                    { id: 'company', label: t('company'), value: company, set: setCompany, type: 'text',  req: false },
                    { id: 'phone',   label: t('phone'),   value: phone,   set: setPhone,   type: 'tel',   req: true },
                    { id: 'email',   label: t('email'),   value: email,   set: setEmail,   type: 'email', req: false },
                  ].map(({ id, label, value, set, type, req }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-obsidian)] mb-1.5">
                        {label} {req && <span className="text-red-500">*</span>}
                      </label>
                      <input id={id} type={type} required={req} value={value} onChange={e => set(e.target.value)}
                        className="w-full border border-[var(--color-sand)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] bg-white" />
                    </div>
                  ))}
                </div>
                {/* Contact method */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-[var(--color-obsidian)] mb-2">{t('preferred_contact')}</p>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { val: 'call',      label: t('contact_call') },
                      { val: 'whatsapp',  label: t('contact_whatsapp') },
                      { val: 'email',     label: t('contact_email') },
                    ].map(({ val, label }) => (
                      <label key={val} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${contactMethod === val ? 'border-[var(--color-deep-green)] bg-[var(--color-deep-green)]/5 font-medium' : 'border-[var(--color-sand)]'}`}>
                        <input type="radio" name="contact" value={val} checked={contactMethod === val} onChange={() => setContactMethod(val)} className="sr-only" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button type="button" onClick={() => setStep(3)} className="btn-outline !text-[var(--color-obsidian)] !border-[var(--color-sand)] hover:!bg-[var(--color-sand)]">{t('back')}</button>
                  <button type="submit" disabled={!name || !phone} className="btn-primary disabled:opacity-40">{t('submit')}</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
