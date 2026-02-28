import Link from 'next/link';
import { MapPin, Layers } from 'lucide-react';
import { StoneProduct } from '@/lib/admin-types';
import AddToQuoteButton from '@/components/products/AddToQuoteButton';

interface Props {
  products: StoneProduct[];
  locale: string;
}

export default function PopularProducts({ products, locale }: Props) {
  const isAr = locale === 'ar';
  const visible = products.filter((p) => p.visible !== false).slice(0, 6);

  if (visible.length === 0) return null;

  const fmtPrice = (n: number) => (isAr ? `${n} ر.س` : `SAR ${n}`);

  return (
    <section className="py-20 bg-white" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-end justify-between mb-10 ${isAr ? 'flex-row-reverse' : ''}`}>
          <div>
            <p className={`text-[var(--color-gold)] text-sm font-semibold mb-2 ${isAr ? '' : 'uppercase tracking-widest'}`}>
              {isAr ? 'منتجاتنا' : 'Our Products'}
            </p>
            <h2
              className="text-3xl font-bold text-[var(--color-obsidian)]"
              style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
            >
              {isAr ? 'أبرز المنتجات' : 'Popular Products'}
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="text-[var(--color-deep-green)] text-sm font-semibold hover:underline"
          >
            {isAr ? 'عرض الكل ←' : 'View All →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((product) => (
            <article
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--color-sand)] hover:border-[var(--color-gold)]/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {product.image && (
                  <img
                    src={product.image}
                    alt={isAr ? product.nameAr : product.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <span className="absolute top-3 start-3 bg-[var(--color-obsidian)]/80 text-[var(--color-gold)] text-xs font-medium px-2.5 py-1 rounded capitalize">
                  {product.category}
                </span>
              </div>

              <div className="p-5">
                <h3
                  className="font-bold text-[var(--color-obsidian)] text-lg mb-1 line-clamp-1"
                  style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
                >
                  {isAr ? product.nameAr : product.nameEn}
                </h3>
                <p className="text-[var(--color-warm-gray)] text-sm leading-relaxed mb-3 line-clamp-2">
                  {isAr ? product.descriptionAr : product.descriptionEn}
                </p>

                {(product.priceFrom || product.priceTo) && (
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xs text-[var(--color-warm-gray)]">
                      {isAr ? 'يبدأ من' : 'Starts from'}
                    </span>
                    <span className="text-[var(--color-deep-green)] font-bold text-sm">
                      {fmtPrice(product.priceFrom ?? 0)}
                    </span>
                    {product.priceTo && (
                      <>
                        <span className="text-xs text-[var(--color-warm-gray)]">–</span>
                        <span className="text-[var(--color-deep-green)] font-bold text-sm">
                          {fmtPrice(product.priceTo)}
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)]">
                    <MapPin size={12} className="text-[var(--color-gold)] shrink-0" />
                    <span>{isAr && product.originAr ? product.originAr : product.origin}</span>
                  </div>
                  {product.finishes.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)]">
                      <Layers size={12} className="text-[var(--color-gold)] shrink-0" />
                      <span className="line-clamp-1">
                        {(isAr && product.finishesAr?.length ? product.finishesAr : product.finishes).join(' · ')}
                      </span>
                    </div>
                  )}
                </div>

                <AddToQuoteButton
                    item={{ id: product.id, type: product.category, nameEn: product.nameEn, nameAr: product.nameAr, image: product.image ?? '', pricePerM2: product.priceFrom }}
                    isAr={isAr}
                  />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
