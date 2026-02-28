'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  type: string;       // 'slate' | 'marble' | 'granite'
  nameEn: string;
  nameAr: string;
  image: string;
}

interface QuoteCartContextType {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const QuoteCartContext = createContext<QuoteCartContextType | null>(null);
const STORAGE_KEY = 'hgs_quote_cart';

export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch { /* ignore */ }
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (item: CartItem) =>
    setItems(prev => prev.some(i => i.id === item.id) ? prev : [...prev, item]);

  const remove = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const clear = () => setItems([]);
  const has = (id: string) => items.some(i => i.id === id);

  return (
    <QuoteCartContext.Provider value={{ items, add, remove, clear, has }}>
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const ctx = useContext(QuoteCartContext);
  if (!ctx) throw new Error('useQuoteCart must be used inside QuoteCartProvider');
  return ctx;
}
