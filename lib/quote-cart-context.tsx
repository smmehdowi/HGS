'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ItemSpecs {
  quantity?: string;
  dimensions?: string;
  thickness?: string;
  finish?: string;
}

export interface CartItem {
  instanceId: string;  // unique per cart entry (same product can appear multiple times)
  id: string;          // product ID
  type: string;
  nameEn: string;
  nameAr: string;
  image: string;
  pricePerM2?: number; // price per m² for PDF quote generation
  specs?: ItemSpecs;
}

export type AddCartItem = Omit<CartItem, 'instanceId' | 'specs'>;

interface QuoteCartContextType {
  items: CartItem[];
  add: (item: AddCartItem) => void;
  remove: (instanceId: string) => void;
  updateSpecs: (instanceId: string, specs: ItemSpecs) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  count: (productId: string) => number;
}

const QuoteCartContext = createContext<QuoteCartContextType | null>(null);
const STORAGE_KEY = 'hgs_quote_cart';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage after mount (migrate old items without instanceId)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        const migrated = parsed.map(item => ({
          ...item,
          instanceId: item.instanceId || generateId(),
        }));
        setItems(migrated);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (item: AddCartItem) =>
    setItems(prev => [...prev, { ...item, instanceId: generateId() }]);

  const remove = (instanceId: string) =>
    setItems(prev => prev.filter(i => i.instanceId !== instanceId));

  const updateSpecs = (instanceId: string, specs: ItemSpecs) =>
    setItems(prev => prev.map(i => i.instanceId === instanceId ? { ...i, specs } : i));

  const clear = () => setItems([]);
  const has = (productId: string) => items.some(i => i.id === productId);
  const count = (productId: string) => items.filter(i => i.id === productId).length;

  return (
    <QuoteCartContext.Provider value={{ items, add, remove, updateSpecs, clear, has, count }}>
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const ctx = useContext(QuoteCartContext);
  if (!ctx) throw new Error('useQuoteCart must be used inside QuoteCartProvider');
  return ctx;
}
