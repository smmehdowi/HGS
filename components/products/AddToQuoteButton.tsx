'use client';

import { ShoppingBag, Check } from 'lucide-react';
import { useQuoteCart, AddCartItem } from '@/lib/quote-cart-context';

interface Props {
  item: AddCartItem;
  isAr?: boolean;
}

export default function AddToQuoteButton({ item, isAr }: Props) {
  const { add, count } = useQuoteCart();
  const cartCount = count(item.id);

  return (
    <button
      type="button"
      onClick={() => add(item)}
      className={`w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg font-semibold transition-all mt-4 ${
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
  );
}
