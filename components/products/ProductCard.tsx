import Link from 'next/link';
import { useLocale } from 'next-intl';
import { MapPin, Layers, ShoppingBag, Check } from 'lucide-react';
import type { StoneProduct } from '@/data/types';
import { useQuoteCart } from '@/lib/quote-cart-context';

type Props = { product: StoneProduct };

function discounted(price: number, pct: number) {
  return Math.round(price * (1 - pct / 100));
}

export default function ProductCard({ product }: Props) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const { add, count } = useQuoteCart();
  const cartCount = count(product.id);
  const pct = product.discountPercent && product.discountPercent > 0 ? product.discountPercent : null;
  const hasPrice = product.priceFrom || product.priceTo;

  const fmtPrice = (n: number) =>
    isAr ? `${n} ر.س` : `SAR ${n}`;

  return (
    <article className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--color-sand)] hover:border-[var(--color-gold)]/40">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={isAr ? product.nameAr : product.nameEn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge */}
        <span className="absolute top-3 start-3 bg-[var(--color-obsidian)]/80 text-[var(--color-gold)] text-xs font-medium px-2.5 py-1 rounded capitalize">
          {product.category}
        </span>
        {/* Diagonal discount ribbon */}
        {pct && (
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
        )}
      </div>

      {/* Content */}
      <div className="p-5" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
        <h3
          className="font-bold text-[var(--color-obsidian)] text-lg mb-1 line-clamp-1"
          style={{ fontFamily: isAr ? 'var(--font-ar-heading)' : 'var(--font-en-heading)' }}
        >
          {isAr ? product.nameAr : product.nameEn}
        </h3>

        <p className="text-[var(--color-warm-gray)] text-sm leading-relaxed mb-3 line-clamp-2">
          {isAr ? product.descriptionAr : product.descriptionEn}
        </p>

        {/* Price range */}
        {hasPrice && (
          <div className="mb-3">
            {pct ? (
              <>
                {/* Original price — crossed out */}
                <p className="text-xs text-[var(--color-warm-gray)] line-through mb-0.5">
                  {isAr ? 'السعر الأصلي: ' : 'Was: '}
                  {fmtPrice(product.priceFrom ?? 0)}
                  {product.priceTo ? ` – ${fmtPrice(product.priceTo)}` : ''}
                </p>
                {/* Discounted price */}
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
              </>
            ) : (
              <div className="flex items-baseline gap-1">
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
          </div>
        )}

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)]">
            <MapPin size={12} className="text-[var(--color-gold)] shrink-0" />
            <span>{isAr && product.originAr ? product.originAr : product.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)]">
            <Layers size={12} className="text-[var(--color-gold)] shrink-0" />
            <span className="line-clamp-1">
              {(isAr && product.finishesAr?.length ? product.finishesAr : product.finishes).join(' · ')}
            </span>
          </div>
        </div>

        {/* Colors */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(isAr && product.colorsAr?.length ? product.colorsAr : product.colors).map((c) => (
            <span
              key={c}
              className="text-xs bg-[var(--color-sand)] text-[var(--color-slate-dark)] px-2 py-0.5 rounded-sm"
            >
              {c}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => add({ id: product.id, type: product.category, nameEn: product.nameEn, nameAr: product.nameAr, image: product.image, pricePerM2: product.priceFrom })}
          className={`w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg font-semibold transition-all ${
            cartCount > 0
              ? 'bg-[var(--color-deep-green)] text-white hover:bg-[var(--color-deep-green-hover)]'
              : 'btn-primary'
          }`}
        >
          {cartCount > 0 ? <Check size={15} /> : <ShoppingBag size={15} />}
          {cartCount > 0
            ? (isAr ? `✓ في الطلب (${cartCount}) · أضف مرة أخرى` : `✓ In Quote (${cartCount}) · Add Again`)
            : (isAr ? 'أضف للطلب' : 'Add to Quote')}
        </button>
      </div>
    </article>
  );
}
