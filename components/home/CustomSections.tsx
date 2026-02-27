import Image from 'next/image';
import Link from 'next/link';
import { CustomSection } from '@/lib/admin-types';

interface Props {
  sections: CustomSection[];
  locale: string;
}

export default function CustomSections({ sections, locale }: Props) {
  const isAr = locale === 'ar';
  const visible = sections.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((section, idx) => {
        const hasImage = Boolean(section.imageUrl);
        const isEven = idx % 2 === 0;

        return (
          <section
            key={section.id}
            className={`py-20 ${isEven ? 'bg-[var(--color-marble-white)]' : 'bg-[var(--color-sand)]'}`}
          >
            <div className="max-w-7xl mx-auto px-6">
              <div
                className={`flex flex-col gap-12 ${
                  hasImage
                    ? `lg:flex-row lg:items-center ${isAr ? 'lg:flex-row-reverse' : isEven ? '' : 'lg:flex-row-reverse'}`
                    : ''
                }`}
              >
                {/* Image */}
                {hasImage && (
                  <div className="lg:w-1/2 relative h-72 lg:h-96 rounded-2xl overflow-hidden">
                    <Image
                      src={section.imageUrl!}
                      alt={isAr ? section.titleAr : section.titleEn}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                )}

                {/* Content */}
                <div className={`${hasImage ? 'lg:w-1/2' : 'max-w-3xl'} ${isAr ? 'text-right' : 'text-left'}`}>
                  <h2 className="text-3xl font-bold text-[var(--color-obsidian)] mb-4">
                    {isAr ? section.titleAr : section.titleEn}
                  </h2>
                  <p className="text-[var(--color-warm-gray)] leading-relaxed whitespace-pre-line">
                    {isAr ? section.contentAr : section.contentEn}
                  </p>
                  {section.ctaUrl && (section.ctaTextEn || section.ctaTextAr) && (
                    <Link
                      href={section.ctaUrl}
                      className="inline-block mt-6 btn-primary"
                    >
                      {isAr ? (section.ctaTextAr || section.ctaTextEn) : (section.ctaTextEn || section.ctaTextAr)}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
