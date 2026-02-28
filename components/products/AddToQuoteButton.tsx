'use client';

import { ShoppingBag, Check } from 'lucide-react';
import { useQuoteCart, CartItem } from '@/lib/quote-cart-context';

interface Props {
  item: CartItem;
  isAr?: boolean;
}

export default function AddToQuoteButton({ item, isAr }: Props) {
  const { add, remove, has } = useQuoteCart();
  const inCart = has(item.id);

  return (
    <button
      type="button"
      onClick={() => inCart ? remove(item.id) : add(item)}
      className={`w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg font-semibold transition-all ${
        inCart
          ? 'bg-[var(--color-deep-green)] text-white hover:bg-[var(--color-deep-green-hover)]'
          : 'btn-primary'
      }`}
    >
      {inCart ? <Check size={15} /> : <ShoppingBag size={15} />}
      {inCart
        ? (isAr ? '✓ أضيف للطلب' : '✓ Added to Quote')
        : (isAr ? 'أضف للطلب' : 'Add to Quote')}
    </button>
  );
}
