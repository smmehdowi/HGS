import Link from 'next/link';
import { MapPin, Tag } from 'lucide-react';
import { StoneProduct } from '@/lib/admin-types';

interface Props {
  products: StoneProduct[];
  locale: string;
}

function discounted(price: number, pct: number) {
  return Math.round(price * (1 - pct / 100));
}

export default function DiscountedProducts({ products, locale }: Props) {
  const isAr = locale === 'ar';
  const onSale = products.filter(
    (p) => p.visible !== false && p.discountPercent && p.discountPercent > 0
  );

  if (onSale.length === 0) return null;

  const fmtPrice = (n: number) => (isAr ? `${n} ر.س` : `SAR ${n}`);

  return (
    <section className="py-20 bg-[var(--color-sand)]" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-end justify-between mb-10 ${isAr ? 'flex-row-reverse' : ''}`}>
          <div>
            <p className={`text-red-600 text-sm font-semibold mb-2 ${isAr ? '' : 'uppercase tracking-widest'}`}>
              {isAr ? 'عروض خاصة' : 'Special Offers'}
            </p>
            <h2
              className="text-3xl font-bold text-[var(--color-obsidian)]"
              style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
            >
              {isAr ? 'منتجات بتخفيضات' : 'Discounted Products'}
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
          {onSale.map((product) => {
            const pct = product.discountPercent!;
            return (
              <article
                key={product.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--color-sand)] hover:border-red-400/40"
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
                  {/* Diagonal discount ribbon */}
                  <div
                    className="absolute bg-red-600 text-white font-bold text-center shadow-lg select-none pointer-events-none"
                    style={{
                      top: '18px',
                      right: '-30px',
                      width: '115px',
                      padding: '5px 0',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      transform: 'rotate(45deg)',
                    }}
                  >
                    {isAr ? `تخفيض ${pct}%` : `${pct}% OFF`}
                  </div>
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
                    <div className="mb-3">
                      <p className="text-xs text-[var(--color-warm-gray)] line-through mb-0.5">
                        {isAr ? 'السعر الأصلي: ' : 'Was: '}
                        {fmtPrice(product.priceFrom ?? 0)}
                        {product.priceTo ? ` – ${fmtPrice(product.priceTo)}` : ''}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-[var(--color-warm-gray)]">
                          {isAr ? 'يبدأ من' : 'Now from'}
                        </span>
                        <span className="text-red-600 font-bold text-sm">
                          {fmtPrice(discounted(product.priceFrom ?? 0, pct))}
                        </span>
                        {product.priceTo && (
                          <>
                            <span className="text-xs text-[var(--color-warm-gray)]">–</span>
                            <span className="text-red-600 font-bold text-sm">
                              {fmtPrice(discounted(product.priceTo, pct))}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)] mb-4">
                    <MapPin size={12} className="text-[var(--color-gold)] shrink-0" />
                    <span>{isAr && product.originAr ? product.originAr : product.origin}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-full font-medium">
                      <Tag size={10} />
                      {isAr ? `وفر ${pct}%` : `Save ${pct}%`}
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/quote?type=${product.category}&variety=${encodeURIComponent(product.nameEn)}`}
                    className="btn-primary w-full justify-center text-sm py-2.5 mt-4"
                  >
                    {isAr ? 'طلب عرض سعر' : 'Request Quote'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
